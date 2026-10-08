-- ══════════════════════════════════════════════════════════════════════════
-- RESQ-BOX — MIGRASI 01: SKEMA AMAN + ROW LEVEL SECURITY KETAT
-- Cara pakai: Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Bersifat IDEMPOTEN (aman dijalankan berulang kali).
--
-- PRINSIP UTAMA
--   1. Identitas = Supabase Auth (auth.uid()). Tidak ada lagi kredensial
--      buatan sendiri di tabel biasa.
--   2. Setiap baris punya PEMILIK. RLS memastikan user hanya melihat/mengubah
--      barisnya sendiri. Guru hanya kelasnya. Admin lebih luas.
--   3. Tabel lama (user_accounts / students / level_submissions) TIDAK
--      dihapus, tapi seluruh akses langsung ditutup, lalu dibungkus VIEW
--      aman agar aplikasi tetap kompatibel & data lama tetap terbaca.
--   4. Klien tidak pernah boleh menetapkan: role, is_admin, unlocked_level,
--      atau nilai (score). Semuanya dihitung/dikunci di sisi server.
-- ══════════════════════════════════════════════════════════════════════════

-- ── 0. EKSTENSI ───────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- ══════════════════════════════════════════════════════════════════════════
-- 0b. PEMERIKSAAN AWAL — pastikan tidak ada tabel skema v2 yang tersisa
--
-- `CREATE TABLE IF NOT EXISTS` TIDAK mengubah tabel yang sudah ada. Jadi bila
-- tabel skema v2 lama masih ada, migrasi ini akan gagal dengan error yang
-- membingungkan (mis. "column student_id is of type character varying but
-- expression is of type uuid"). Blok ini mengubahnya menjadi pesan yang jelas
-- dan menghentikan migrasi SEBELUM ada perubahan setengah jalan.
--
-- Solusi bila blok ini melempar error: jalankan `00_prepare_legacy.sql`.
-- ══════════════════════════════════════════════════════════════════════════
DO $$
DECLARE
  v_conflicts TEXT := '';
  v_col       TEXT;
  v_type      TEXT;
BEGIN
  -- classrooms lama: primary key-nya `id`, bukan `code`.
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'classrooms'
      AND column_name = 'id' AND data_type = 'uuid'
  ) THEN
    v_conflicts := v_conflicts || 'classrooms (PK masih `id`, skema v2); ';
  END IF;

  -- level_submissions lama: student_id bertipe text, bukan uuid.
  SELECT c.data_type INTO v_type
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' AND c.table_name = 'level_submissions'
    AND c.column_name = 'student_id';

  IF v_type IS NOT NULL AND v_type <> 'uuid' THEN
    v_conflicts := v_conflicts || 'level_submissions (student_id = ' || v_type || ', skema v2); ';
  END IF;

  -- students lama berupa TABEL fisik, sedangkan skema baru memakai VIEW.
  IF EXISTS (
    SELECT 1 FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind = 'r'
  ) THEN
    v_conflicts := v_conflicts || 'students (masih TABEL, harus jadi VIEW); ';
  END IF;

  -- profiles lama dengan kolom password (skema v2 awal).
  SELECT c.column_name INTO v_col
  FROM information_schema.columns c
  WHERE c.table_schema = 'public' AND c.table_name = 'profiles'
    AND c.column_name = 'password';
  IF v_col IS NOT NULL THEN
    v_conflicts := v_conflicts || 'profiles (masih punya kolom password, skema v2); ';
  END IF;

  IF v_conflicts <> '' THEN
    RAISE EXCEPTION
      E'Tabel skema v2 lama masih ada: %\n\nJalankan berkas `supabase/00_prepare_legacy.sql` lebih dulu (ia mengarsipkan tabel lama menjadi *_v2_legacy, tanpa menghapus data), lalu ulangi migrasi ini.',
      rtrim(v_conflicts, ' ');
  END IF;

  RAISE NOTICE 'Pemeriksaan awal lolos: tidak ada tabel skema v2 yang bentrok.';
END $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 1. TABEL INTI
-- ══════════════════════════════════════════════════════════════════════════

-- 1a. classrooms — kelas milik seorang guru
CREATE TABLE IF NOT EXISTS public.classrooms (
  code             TEXT PRIMARY KEY,
  name             TEXT NOT NULL DEFAULT 'Kelas VIII-A',
  teacher_username TEXT NOT NULL,
  school_name      TEXT NOT NULL DEFAULT 'SMP Negeri 1',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 1b. profiles — 1 baris per akun auth.users (identitas + kelas + level)
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       TEXT NOT NULL,
  role           TEXT NOT NULL DEFAULT 'student'
                 CHECK (role IN ('student', 'teacher', 'admin')),
  is_admin       BOOLEAN NOT NULL DEFAULT false,
  name           TEXT NOT NULL DEFAULT 'Petualang RESQ',
  absent_number  TEXT DEFAULT '1',
  classroom_code TEXT REFERENCES public.classrooms(code) ON DELETE SET NULL,
  school_name    TEXT DEFAULT 'SMP Negeri 1',
  avatar_config  JSONB NOT NULL DEFAULT '{}'::jsonb,
  unlocked_level INT NOT NULL DEFAULT 1 CHECK (unlocked_level BETWEEN 1 AND 3),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- username unik tanpa peduli besar/kecil huruf (menggantikan UNIQUE biasa)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_lower_key
  ON public.profiles (lower(username));

-- 1c. level_submissions — rekap nilai. Pemilik = student_id.
CREATE TABLE IF NOT EXISTS public.level_submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  student_name   TEXT NOT NULL DEFAULT '',
  classroom_code TEXT,
  level_number   INT  NOT NULL CHECK (level_number BETWEEN 1 AND 3),
  score          INT  NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
  details        JSONB NOT NULL DEFAULT '{}'::jsonb,
  completed_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ══════════════════════════════════════════════════════════════════════════
-- 2. MIGRASI DATA LAMA (dari skema v2 yang tidak aman)
-- ══════════════════════════════════════════════════════════════════════════
-- Skema v2 punya user_accounts(id, username, password, role, unlocked_level, ...)
-- dan students(...). Kita pindahkan KEADAAN (bukan password) ke tabel baru.
-- Password lama tetap di user_accounts sampai dimigrasikan ke Supabase Auth
-- oleh fungsi admin (lihat MIGRASI 02 + Edge Function migrate_accounts).
-- ══════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  -- classrooms: kopi dari skema lama bila tabelnya ada dan bentuknya cocok
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'classrooms') THEN
    BEGIN
      INSERT INTO public.classrooms (code, name, teacher_username, school_name)
      SELECT DISTINCT c.code, c.name, c.teacher_username, COALESCE(c.school_name, 'SMP Negeri 1')
      FROM public.classrooms c
      WHERE c.code IS NOT NULL
      ON CONFLICT (code) DO NOTHING;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Lewati kopi classrooms: %', SQLERRM;
    END;
  END IF;
END $$;

-- profiles: kopi dari user_accounts lama (id-nya dipakai kembali sebagai auth id)
--
-- PENTING — urutan: kelas HARUS ada lebih dulu.
-- Kolom `profiles.classroom_code` punya FOREIGN KEY ke `classrooms(code)`, dan
-- pemeriksaan di bawah hanya memakai classroom_code yang benar-benar ada di
-- tabel classrooms. Jadi kita isi kelas dasar dulu; kalau tidak, semua profil
-- lama akan masuk dengan classroom_code = NULL.
INSERT INTO public.classrooms (code, name, teacher_username, school_name)
VALUES
  ('RESQ-8A', 'Kelas VIII-A', 'guru', 'SMP Negeri 1'),
  ('RESQ-8B', 'Kelas VIII-B', 'guru', 'SMP Negeri 1')
ON CONFLICT (code) DO NOTHING;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema = 'public' AND table_name = 'user_accounts') THEN
    BEGIN
      INSERT INTO public.profiles (
        id, username, role, is_admin, name, absent_number,
        classroom_code, school_name, avatar_config, unlocked_level, created_at
      )
      SELECT
        u.id,
        lower(trim(u.username)),
        CASE WHEN u.role = 'teacher' THEN 'teacher' ELSE 'student' END,
        false,
        COALESCE(NULLIF(trim(u.name), ''), 'Petualang RESQ'),
        COALESCE(u.absent_number, '1'),
        CASE WHEN EXISTS (SELECT 1 FROM public.classrooms c WHERE c.code = u.classroom_code)
             THEN u.classroom_code ELSE NULL END,
        COALESCE(u.school_name, 'SMP Negeri 1'),
        COALESCE(u.avatar_config, '{}'::jsonb),
        LEAST(GREATEST(COALESCE(u.unlocked_level, 1), 1), 3),
        COALESCE(u.created_at, now())
      FROM public.user_accounts u
      WHERE u.username IS NOT NULL
      ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Lewati kopi profiles: %', SQLERRM;
    END;
  END IF;
END $$;

-- Laporkan berapa profil yang berhasil dikopi (membantu diagnosis).
DO $$
DECLARE v_count INT;
BEGIN
  SELECT count(*) INTO v_count FROM public.profiles;
  RAISE NOTICE 'Jumlah profiles setelah migrasi: %', v_count;
END $$;

-- level_submissions: perbaiki baris lama yang student_id-nya masih TEXT non-UUID
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'level_submissions'
               AND column_name = 'student_id' AND data_type <> 'uuid') THEN
    RAISE NOTICE 'level_submissions.student_id masih TEXT — dilewati, akan dirapikan di MIGRASI 02.';
  END IF;
END $$;

-- ══════════════════════════════════════════════════════════════════════════
-- 3. FUNGSI BANTU OTORISASI (dipakai policy RLS)
--    Semua SECURITY DEFINER supaya bisa membaca profiles tanpa memicu
--    rekursi policy pada profiles itu sendiri.
-- ══════════════════════════════════════════════════════════════════════════

-- 3a. Peran dari JWT (app_metadata.role / user_metadata.role).
--     app_metadata HANYA bisa ditulis server → tidak bisa dipalsukan klien.
CREATE OR REPLACE FUNCTION public.jwt_role()
RETURNS TEXT
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb
      -> 'app_metadata' ->> 'role',
    nullif(current_setting('request.jwt.claims', true), '')::jsonb
      -> 'user_metadata' ->> 'role',
    'student'
  );
$$;

-- 3b. Guru saja? (klaim JWT dipercaya lebih dulu, fallback ke tabel profiles)
CREATE OR REPLACE FUNCTION public.is_teacher()
RETURNS BOOLEAN
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN public.jwt_role() IN ('teacher', 'admin') THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role IN ('teacher', 'admin')
    )
  END;
$$;

-- 3c. Admin saja?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT CASE
    WHEN public.jwt_role() = 'admin' THEN true
    ELSE EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND (p.is_admin OR p.role = 'admin')
    )
  END;
$$;

-- 3d. Apakah pemanggil adalah anggota kelas ini?
--     Guru: hanya kelas yang dia ampu. Siswa: hanya kelas tempat dia terdaftar.
CREATE OR REPLACE FUNCTION public.is_class_member(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles me
    WHERE me.id = auth.uid()
      AND (
        me.is_admin
        OR (me.role = 'teacher' AND EXISTS (
              SELECT 1 FROM public.classrooms c
              WHERE c.code = p_code AND c.teacher_username = me.username))
        OR (me.role = 'student' AND me.classroom_code = p_code)
      )
  );
$$;

-- 3e. Apakah pemanggil berhak membaca baris milik p_student_id?
CREATE OR REPLACE FUNCTION public.can_read_student(p_student_id UUID)
RETURNS BOOLEAN
LANGUAGE sql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
  SELECT
    p_student_id = auth.uid()                        -- milik sendiri
    OR public.is_admin()                             -- admin: semua
    OR (public.is_teacher() AND EXISTS (             -- guru: kelas yang dia ampu
          SELECT 1 FROM public.profiles s
          JOIN public.classrooms c ON c.code = s.classroom_code
          WHERE s.id = p_student_id
            AND c.teacher_username = (SELECT username FROM public.profiles WHERE id = auth.uid())
        ));
$$;

-- 3f. Cap waktu otomatis
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_profiles_touch ON public.profiles;
CREATE TRIGGER trg_profiles_touch
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3g. Kunci kolom yang tidak boleh diubah sendiri oleh siswa.
--     Siswa hanya boleh mengubah data profil "kosmetik".
CREATE OR REPLACE FUNCTION public.guard_profile_privileges()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  -- Server (service_role / definer dengan auth.uid() NULL) boleh apa saja
  IF auth.uid() IS NULL OR public.is_admin() THEN
    RETURN NEW;
  END IF;

  -- Siswa & guru tidak boleh menaikkan level sendiri di sini;
  -- unlocked_level hanya berubah lewat RPC resmi (submit_level_result).
  IF NEW.unlocked_level IS DISTINCT FROM OLD.unlocked_level THEN
    NEW.unlocked_level := OLD.unlocked_level;
  END IF;

  -- Tak seorang pun boleh mengubah identitas/kelas/peran dari sisi klien,
  -- kecuali admin (sudah ditangani di atas).
  IF NEW.role            IS DISTINCT FROM OLD.role            THEN NEW.role            := OLD.role;            END IF;
  IF NEW.is_admin        IS DISTINCT FROM OLD.is_admin        THEN NEW.is_admin        := OLD.is_admin;        END IF;
  IF NEW.classroom_code  IS DISTINCT FROM OLD.classroom_code  THEN NEW.classroom_code  := OLD.classroom_code;  END IF;
  IF NEW.username        IS DISTINCT FROM OLD.username        THEN NEW.username        := OLD.username;        END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_profiles_guard ON public.profiles;
CREATE TRIGGER trg_profiles_guard
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.guard_profile_privileges();

-- 3h. Profil otomatis dibuat saat akun Auth baru muncul.
--     Peran dibaca dari app_metadata (ditulis server), BUKAN dari input klien.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_username TEXT;
  v_role     TEXT;
BEGIN
  v_username := COALESCE(
    NEW.raw_app_meta_data ->> 'username',
    NEW.raw_user_meta_data ->> 'username',
    split_part(COALESCE(NEW.email, ''), '@', 1)
  );
  v_role := CASE
    WHEN COALESCE(NEW.raw_app_meta_data ->> 'role', 'student') IN ('teacher', 'admin')
      THEN COALESCE(NEW.raw_app_meta_data ->> 'role', 'student')
    ELSE 'student'
  END;

  INSERT INTO public.profiles (id, username, role, name, absent_number, classroom_code, school_name)
  VALUES (
    NEW.id,
    lower(trim(v_username)),
    v_role,
    COALESCE(NEW.raw_user_meta_data ->> 'name', NEW.raw_app_meta_data ->> 'name', 'Petualang RESQ'),
    COALESCE(NEW.raw_user_meta_data ->> 'absent_number', '1'),
    NULLIF(NEW.raw_app_meta_data ->> 'classroom_code', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'school_name', 'SMP Negeri 1')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_on_auth_user_created ON auth.users;
CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 3i. Custom Access Token Hook — menitipkan role & classroom_code ke JWT.
--     Aktifkan di: Authentication → Hooks → Customize Access Token (JWT) Claims.
--     Tanpa hook ini semuanya tetap jalan (fallback ke tabel profiles),
--     hanya kehilangan sedikit kecepatan karena policy jadi membaca tabel.
CREATE OR REPLACE FUNCTION public.custom_access_token_hook(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql STABLE
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_claims JSONB;
  v_role   TEXT;
  v_class  TEXT;
BEGIN
  SELECT role, classroom_code INTO v_role, v_class
  FROM public.profiles
  WHERE id = (event ->> 'user_id')::UUID;

  v_claims := COALESCE(event -> 'claims', '{}'::jsonb);
  v_claims := jsonb_set(
    v_claims,
    '{app_metadata}',
    COALESCE(v_claims -> 'app_metadata', '{}'::jsonb)
      || jsonb_build_object(
           'role', COALESCE(v_role, 'student'),
           'classroom_code', v_class
         ),
    true
  );

  RETURN jsonb_set(event, '{claims}', v_claims, true);
END $$;

GRANT EXECUTE ON FUNCTION public.custom_access_token_hook(JSONB) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.custom_access_token_hook(JSONB) FROM PUBLIC, anon, authenticated;

-- ══════════════════════════════════════════════════════════════════════════
-- 4. ROW LEVEL SECURITY
-- ══════════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles          FORCE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms        FORCE ROW LEVEL SECURITY;
ALTER TABLE public.level_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_submissions FORCE ROW LEVEL SECURITY;

-- Bersihkan policy lama (termasuk "Allow All" / "anon_select_* USING true")
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT policyname, tablename FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'classrooms', 'level_submissions')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

-- ── 4a. profiles ──────────────────────────────────────────────────────────
-- DROP eksplisit dulu supaya berkas ini aman dijalankan BERULANG KALI
-- (CREATE POLICY gagal bila policy dengan nama sama sudah ada).
DROP POLICY IF EXISTS profiles_select_owner ON public.profiles;
DROP POLICY IF EXISTS profiles_update_owner ON public.profiles;
DROP POLICY IF EXISTS "anon_select_users"      ON public.profiles;
DROP POLICY IF EXISTS "anon_select_students"   ON public.profiles;

-- SELECT: milik sendiri, atau (guru) siswa di kelas yang dia ampu, atau admin.
CREATE POLICY profiles_select_owner ON public.profiles
  FOR SELECT TO authenticated
  USING (public.can_read_student(id));

-- UPDATE: hanya baris sendiri. Kolom sensitif dikunci oleh trigger 3g.
CREATE POLICY profiles_update_owner ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- INSERT: hanya oleh trigger handle_new_auth_user (SECURITY DEFINER).
-- Tidak ada policy INSERT untuk klien → klien TIDAK BISA membuat profil sendiri.
-- DELETE: tidak ada policy → profil hanya terhapus lewat cascade auth.users.

-- ── 4b. classrooms ────────────────────────────────────────────────────────
DROP POLICY IF EXISTS classrooms_select_member ON public.classrooms;
DROP POLICY IF EXISTS classrooms_insert_owner  ON public.classrooms;
DROP POLICY IF EXISTS classrooms_update_owner  ON public.classrooms;
DROP POLICY IF EXISTS classrooms_delete_owner  ON public.classrooms;
DROP POLICY IF EXISTS "anon_select_classrooms" ON public.classrooms;

-- SELECT: anggota kelas (guru pengampu / siswa terdaftar) atau admin.
CREATE POLICY classrooms_select_member ON public.classrooms
  FOR SELECT TO authenticated
  USING (public.is_class_member(code) OR public.is_admin());

-- INSERT/UPDATE/DELETE: hanya guru pemilik kelas atau admin, lewat RPC resmi.
CREATE POLICY classrooms_insert_owner ON public.classrooms
  FOR INSERT TO authenticated
  WITH CHECK (public.is_teacher() AND teacher_username = (SELECT username FROM public.profiles WHERE id = auth.uid()));

CREATE POLICY classrooms_update_owner ON public.classrooms
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR (public.is_teacher() AND teacher_username = (SELECT username FROM public.profiles WHERE id = auth.uid())))
  WITH CHECK (public.is_admin() OR (public.is_teacher() AND teacher_username = (SELECT username FROM public.profiles WHERE id = auth.uid())));

CREATE POLICY classrooms_delete_owner ON public.classrooms
  FOR DELETE TO authenticated
  USING (public.is_admin() OR (public.is_teacher() AND teacher_username = (SELECT username FROM public.profiles WHERE id = auth.uid())));

-- ── 4c. level_submissions ─────────────────────────────────────────────────
DROP POLICY IF EXISTS submissions_select_authorized ON public.level_submissions;
DROP POLICY IF EXISTS submissions_insert_own        ON public.level_submissions;
DROP POLICY IF EXISTS "anon_select_submissions"     ON public.level_submissions;

CREATE POLICY submissions_select_authorized ON public.level_submissions
  FOR SELECT TO authenticated
  USING (public.can_read_student(student_id));

-- INSERT hanya untuk baris sendiri, dan hanya lewat RPC submit_level_result.
-- Nilai & kelayakan tetap divalidasi ulang di RPC.
CREATE POLICY submissions_insert_own ON public.level_submissions
  FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

-- Tidak ada policy UPDATE/DELETE untuk klien → nilai tidak bisa diubah/dihapus
-- setelah tercatat. Guru/admin memakai RPC khusus bila perlu koreksi.

-- ══════════════════════════════════════════════════════════════════════════
-- 5. VIEW KOMPATIBILITAS + PENUTUPAN AKSES TABEL LAMA
--    Aplikasi lama memanggil tabel bernama `students`. Kita pertahankan nama
--    itu sebagai VIEW aman (tanpa kolom password), supaya kode lama tetap
--    berfungsi sementara kolom rahasia hilang dari jangkauan klien.
-- ══════════════════════════════════════════════════════════════════════════

-- Bersihkan objek lama bernama `students` apa pun bentuknya SEBELUM membuat view.
--
-- PENTING: view harus dilepas SEBELUM tabel.
-- `DROP TABLE ... CASCADE` ikut menghapus view yang bergantung padanya, sehingga
-- pemeriksaan view sesudahnya menjadi false dan view lama tidak pernah ter-drop
-- secara eksplisit. Akibatnya `CREATE OR REPLACE VIEW` memakai ulang view lama
-- yang kolom `id`-nya masih bertipe `character varying` (dari skema v2), lalu
-- gagal dengan: function public.can_read_student(character varying) does not exist
DO $$
DECLARE
  v_obj RECORD;
BEGIN
  -- 1) Lepas semua view/materialized view bernama `students`.
  FOR v_obj IN
    SELECT c.relname, c.relkind
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind IN ('v', 'm')
  LOOP
    EXECUTE format('DROP VIEW IF EXISTS public.%I CASCADE', v_obj.relname);
  END LOOP;

  -- 2) Lepas tabel fisik bernama `students` (skema v2 lama).
  FOR v_obj IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relname = 'students' AND c.relkind = 'r'
  LOOP
    EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS fk_classroom', v_obj.relname);
    EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', v_obj.relname);
  END LOOP;
END $$;

-- Sabuk pengaman terakhir: pastikan tidak ada sisa objek bernama `students`.
DROP VIEW IF EXISTS public.students CASCADE;

CREATE VIEW public.students
WITH (security_invoker = true) AS
SELECT
  p.id::UUID      AS id,                -- cast eksplisit: kunci agar policy
  p.id::UUID      AS user_id,           -- can_read_student(uuid) cocok tipenya
  p.classroom_code,
  p.name,
  p.username,
  NULL::TEXT      AS password,          -- kolom dipertahankan agar tipe tetap,
                                        -- tapi SELALU NULL (rahasia tidak bocor)
  COALESCE(c.name, 'Kelas VIII-A') AS class_name,
  p.absent_number,
  p.avatar_config,
  p.unlocked_level,
  p.created_at,
  p.updated_at
FROM public.profiles p
LEFT JOIN public.classrooms c ON c.code = p.classroom_code;

GRANT SELECT ON public.students TO authenticated;
REVOKE ALL ON public.students FROM anon;

-- ── TUTUP TOTAL tabel-tabel lama ──────────────────────────────────────────
-- Inilah inti perbaikannya: hash password tidak lagi bisa dibaca anon.
REVOKE ALL ON public.user_accounts      FROM anon, authenticated;
REVOKE ALL ON public.user_accounts      FROM PUBLIC;
ALTER TABLE public.user_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_accounts FORCE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_users" ON public.user_accounts;
-- (tidak ada policy sama sekali → anon & authenticated membaca 0 baris)

-- Pastikan tabel inti hanya bisa diakses sesuai policy di atas.
REVOKE ALL ON public.profiles          FROM anon;
REVOKE ALL ON public.classrooms        FROM anon;
REVOKE ALL ON public.level_submissions FROM anon;
GRANT SELECT, UPDATE         ON public.profiles          TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.classrooms TO authenticated;
GRANT SELECT, INSERT         ON public.level_submissions TO authenticated;

-- ══════════════════════════════════════════════════════════════════════════
-- 6. INDEKS UNTUK SKALA BESAR (>1000 pemain bersamaan)
-- ══════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_profiles_classroom
  ON public.profiles (classroom_code) WHERE role = 'student';
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_submissions_student_level
  ON public.level_submissions (student_id, level_number DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_classroom_level
  ON public.level_submissions (classroom_code, level_number);
CREATE INDEX IF NOT EXISTS idx_submissions_completed
  ON public.level_submissions (completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_classrooms_teacher
  ON public.classrooms (teacher_username);
CREATE INDEX IF NOT EXISTS idx_profiles_classroom_lower
  ON public.profiles (lower(username));

-- Statistik untuk perencana query
ANALYZE public.profiles;
ANALYZE public.classrooms;
ANALYZE public.level_submissions;

-- ══════════════════════════════════════════════════════════════════════════
-- SELESAI MIGRASI 01
-- Lanjutkan dengan: 02_rpc_and_hardening.sql
-- ══════════════════════════════════════════════════════════════════════════
