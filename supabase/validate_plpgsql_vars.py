#!/usr/bin/env python3
"""
Pemeriksa variabel PL/pgSQL untuk migrasi RESQ-BOX.

Dipicu oleh bug nyata:
    ERROR 42601: loop variable of FOREACH must be a known variable or
    list of variables
yang terjadi karena `sig` dipakai di `FOREACH sig IN ARRAY sigs` tetapi
tidak dideklarasikan di blok DECLARE.

`pglast` TIDAK bisa menangkap kelas error ini: ia memvalidasi sintaks, bukan
resolusi variabel PL/pgSQL (itu terjadi saat runtime di server). Skrip ini
memeriksa hal yang tidak bisa dilakukan pglast:

  1. Setiap variabel loop `FOREACH <var>` harus dideklarasikan.
  2. Variabel yang di-assign (`<var> := ...`) harus dideklarasikan.
  3. Variabel yang dirujuk di `format(...)` harus dideklarasikan
     (pola yang paling sering dipakai untuk REVOKE/GRANT dinamis).

Pakai:
    python supabase/validate_plpgsql_vars.py
Keluar dengan kode 1 bila ada temuan.
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

SUPABASE_DIR = Path(__file__).resolve().parent

# Tipe yang bisa dipakai sebagai deklarasi variabel.
TYPES = (
    r"TEXT|VARCHAR|CHAR|INT|INTEGER|BIGINT|SMALLINT|NUMERIC|DECIMAL|REAL|"
    r"DOUBLE\s+PRECISION|BOOLEAN|BOOL|UUID|JSON|JSONB|DATE|TIMESTAMP(?:TZ)?|"
    r"RECORD|VOID|ANYELEMENT|REGROCEDURE|REGCLASS|OID"
)
DECL_RE = re.compile(rf"\b(\w+)\s+(?:{TYPES})\b", re.IGNORECASE)

# Nama yang bukan variabel (kata kunci, tipe, fungsi bawaan/nama kolom umum).
KEYWORDS = {
    "array", "select", "from", "where", "insert", "update", "delete", "into",
    "values", "set", "begin", "end", "declare", "loop", "for", "foreach", "in",
    "if", "then", "else", "elsif", "case", "when", "return", "returns", "as",
    "and", "or", "not", "null", "true", "false", "is", "distinct", "on",
    "conflict", "do", "nothing", "language", "plpgsql", "sql", "stable",
    "immutable", "volatile", "security", "definer", "invoker", "set", "search_path",
    "public", "auth", "extensions", "pg_temp", "new", "old", "tg_name", "tg_op",
    "execute", "format", "raise", "notice", "exception", "when", "others",
    "sqlstate", "sqlerrm", "found", "get", "diagnostics", "row_count", "perform",
    "using", "err code", "err msg", "re", "interval", "date_trunc", "now",
    "coalesce", "nullif", "greatest", "least", "count", "max", "min", "sum",
    "jsonb_build_object", "jsonb_set", "to_jsonb", "row_to_json", "gen_random_uuid",
    "crypt", "gen_salt", "lower", "upper", "trim", "length", "split_part",
    "make_interval", "information_schema", "pg_class", "pg_namespace", "pg_proc",
    "pg_policies", "pg_trigger", "pg_attribute", "pg_indexes", "pg_type",
    "attrelid", "attnum", "attisdropped", "attname", "atttypid", "atttypmod",
    "relname", "relkind", "relnamespace", "oid", "nspname", "policyname",
    "tablename", "schemaname", "qual", "with_check", "tgname", "tgrelid",
    "tgisinternal", "prosrc", "proname", "prosecdef", "proconfig", "prokind",
    "pronamespace", "indexname", "idx", "row", "col", "table_name", "column_name",
    "data_type", "table_schema", "constraint_name", "ordinal_position",
}


def find_blocks(sql: str) -> list[tuple[int, str, str]]:
    """Ambil semua blok `DO $$ ... $$` dan badan fungsi plpgsql.

    Mengembalikan (baris_awal, teks_declare, teks_body).
    """
    blocks: list[tuple[int, str, str]] = []

    # DO $$ DECLARE ... BEGIN ... END $$;
    for m in re.finditer(r"\bDO\s*\$(\w*)\$(.*?)\$\1\$", sql, re.DOTALL | re.IGNORECASE):
        body, start = m.group(2), m.start()
        line = sql[:start].count("\n") + 1
        dm = re.search(r"\bDECLARE\b(.*?)\bBEGIN\b", body, re.DOTALL | re.IGNORECASE)
        declare = dm.group(1) if dm else ""
        blocks.append((line, declare, body))

    # CREATE FUNCTION ... AS $$ DECLARE ... BEGIN ... END $$;
    for m in re.finditer(
        r"CREATE\s+(?:OR\s+REPLACE\s+)?FUNCTION\s+\S+\s*\((?:[^)]*)\)(.*?)\$\$",
        sql,
        re.DOTALL | re.IGNORECASE,
    ):
        pass  # header saja tidak cukup; badan diambil lewat pola di bawah

    for m in re.finditer(
        r"LANGUAGE\s+plpgsql(.*?)\$\$",
        sql,
        re.DOTALL | re.IGNORECASE,
    ):
        pass

    # Badan fungsi plpgsql: cari $$ ... $$ yang berisi DECLARE/BEGIN
    for m in re.finditer(r"\$(\w*)\$(.*?)\$\1\$", sql, re.DOTALL):
        body, start = m.group(2), m.start()
        if not re.search(r"\b(BEGIN|DECLARE)\b", body, re.IGNORECASE):
            continue
        line = sql[:start].count("\n") + 1
        # Sudah ditangani sebagai DO block?
        if re.search(r"\bDO\s*$", sql[max(0, start - 40):start], re.IGNORECASE):
            continue
        dm = re.search(r"\bDECLARE\b(.*?)\bBEGIN\b", body, re.DOTALL | re.IGNORECASE)
        declare = dm.group(1) if dm else ""
        blocks.append((line, declare, body))

    return blocks


def check_file(path: Path) -> int:
    sql = path.read_text(encoding="utf-8")
    problems = 0

    for line_no, declare, body in find_blocks(sql):
        # Variabel yang dideklarasikan (termasuk parameter fungsi via DECLARE)
        declared = {m.group(1).lower() for m in DECL_RE.finditer(declare)}
        # Parameter fungsi muncul di header: (p_x TEXT, ...)
        declared |= {m.group(1).lower() for m in DECL_RE.finditer(body[:0])}

        # (1) FOREACH <var> IN ...
        for m in re.finditer(r"\bFOREACH\s+(\w+)\s+IN\b", body, re.IGNORECASE):
            var = m.group(1).lower()
            if var not in declared:
                rel = body[:m.start()].count("\n") + line_no
                print(f"  [FAIL] {path.name}:{rel}  FOREACH {var} — tidak dideklarasikan")
                problems += 1

        # (2) <var> := ...
        for m in re.finditer(r"(?<![\w.])(\w+)\s*:=", body):
            var = m.group(1).lower()
            # Lewati nama tipe (mis. `v_x TEXT := '...'` → yang tertangkap 'text').
            if re.fullmatch(TYPES, m.group(1), re.IGNORECASE):
                continue
            if var in KEYWORDS or var in declared:
                continue
            rel = body[:m.start()].count("\n") + line_no
            print(f"  [FAIL] {path.name}:{rel}  '{var} :=' — mungkin tidak dideklarasikan")
            problems += 1

        # (3) Variabel di dalam format(...) untuk REVOKE/GRANT dinamis
        for m in re.finditer(r"format\(\s*'[^']*'(.*?)\)", body, re.DOTALL):
            args = m.group(1)
            for am in re.finditer(r"(?<![\w.'])([a-z_]\w*)", args, re.IGNORECASE):
                var = am.group(1).lower()
                if var in KEYWORDS or var in declared:
                    continue
                if len(var) <= 2:
                    continue
                rel = body[:m.start()].count("\n") + line_no
                print(f"  [FAIL] {path.name}:{rel}  format(): '{var}' — mungkin tidak dideklarasikan")
                problems += 1

    return problems


def main() -> int:
    files = sorted(SUPABASE_DIR.glob("**/*.sql"))
    print("Pemeriksaan variabel PL/pgSQL (FOREACH / assignment / format)")
    print("-" * 70)
    total = 0
    for path in files:
        total += check_file(path)

    print("-" * 70)
    if total:
        print(f"HASIL: {total} temuan perlu diperiksa.")
    else:
        print("HASIL: tidak ada variabel PL/pgSQL yang mencurigakan.")
    return 1 if total else 0


if __name__ == "__main__":
    raise SystemExit(main())
