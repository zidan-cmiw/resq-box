"""Fourth pass: real over-the-wire transfer sizes for everything the client downloads.

Accounts for gzip on text-ish content types (which the host applies) and raw bytes
for already-compressed binaries (jpg/png/webp/stl-no-encoding). Read-only.

Outputs a per-file table and the totals used in assets.md.
"""
import gzip
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.abspath(os.path.join(BASE, "..", "dist"))
PUBLIC = os.path.abspath(os.path.join(BASE, "..", "public"))

# Content types the host typically compresses.
COMPRESSIBLE_EXT = {".js", ".css", ".html", ".svg", ".json", ".webmanifest", ".txt"}
# workbox default from node_modules/workbox-build/build/types.d.ts (@default 2097152)
WORKBOX_MAX = 2097152


def transfer(path: str) -> tuple[int, int]:
    raw = open(path, "rb").read()
    ext = os.path.splitext(path)[1].lower()
    if ext in COMPRESSIBLE_EXT:
        return len(raw), len(gzip.compress(raw, 9))
    return len(raw), len(raw)


sw = open(os.path.join(DIST, "sw.js"), encoding="utf-8").read()
urls = re.findall(r'url:"([^"]+)"', sw)

print("=== A. PWA precache manifest (dist/sw.js) - %d entries ===" % len(urls))
print(f"{'entry':44} {'raw':>10} {'transfer':>10} {'encoding':>9}")
print("-" * 78)
raw_tot = wire_tot = 0
skipped = []
for u in urls:
    p = os.path.join(DIST, u.replace("/", os.sep))
    if not os.path.exists(p):
        print(f"{u:44} {'MISSING':>10}")
        continue
    raw, wire = transfer(p)
    raw_tot += raw
    wire_tot += wire
    enc = "gzip" if wire != raw else "-"
    flag = "  <-- >2MiB: workbox would SKIP" if raw > WORKBOX_MAX else ""
    if raw > WORKBOX_MAX:
        skipped.append((u, raw))
    print(f"{u:44} {raw:>10,} {wire:>10,} {enc:>9}{flag}")
print("-" * 78)
print(f"{'TOTAL':44} {raw_tot:>10,} {wire_tot:>10,}")
print(f"  raw on disk : {raw_tot:,} B ({raw_tot/1024/1024:.2f} MiB)")
print(f"  wire (gzip) : {wire_tot:,} B ({wire_tot/1024/1024:.2f} MiB)")
print(f"  compression saving: {raw_tot-wire_tot:,} B ({100*(1-wire_tot/raw_tot):.1f}%)")
print()

print("=== B. Referenced assets NOT precached (downloaded on demand) ===")
print(f"{'asset':40} {'raw':>10} {'transfer':>10} {'encoding':>9}")
print("-" * 74)
on_demand = [
    "terrain-688.stl",
    "bg-rainforest.jpg",
    "bg-teacher-clouds.jpg",
    "peta_lapisan_bumi.jpg",
    "radar_bumi_lengkap.jpg",
    "1.webp",
    "images.jpeg",
    "lahar_dingin.jpg",
    "wedhus_gembel.jpg",
]
od_raw = od_wire = 0
for rel in on_demand:
    p = os.path.join(PUBLIC, rel)
    raw, wire = transfer(p)
    od_raw += raw
    od_wire += wire
    enc = "gzip" if wire != raw else "-"
    print(f"{rel:40} {raw:>10,} {wire:>10,} {enc:>9}")
print("-" * 74)
print(f"{'TOTAL on-demand':40} {od_raw:>10,} {od_wire:>10,}")
print()

print("=== C. Unreferenced files (0 references in src/, index.html, index.css) ===")
unref = ["icons.svg", "radar_bumi.png", "radar_bumi.svg", "radar_bumi_lengkap_label.png",
         "radar_bumi_lengkap_label.svg", "images (1).jpg", "images (1).jpeg"]
u_tot = 0
for rel in unref:
    p = os.path.join(PUBLIC, rel)
    n = os.path.getsize(p)
    u_tot += n
    in_pre = rel in urls
    print(f"{rel:40} {n:>10,}   in precache: {in_pre}")
frames_dir = os.path.join(PUBLIC, "frames")
f_tot = sum(os.path.getsize(os.path.join(frames_dir, f)) for f in os.listdir(frames_dir))
print(f"{'frames/* (13 files)':40} {f_tot:>10,}   in precache: False")
print("-" * 74)
print(f"TOTAL unreferenced: {u_tot + f_tot:,} B ({(u_tot+f_tot)/1024/1024:.2f} MiB)")
print(f"  of which precached (cost per client): "
      f"{sum(os.path.getsize(os.path.join(PUBLIC, r)) for r in unref if r in urls):,} B")
print()

print("=== D. Per-session wire cost, today vs after the asset plan ===")
precache_wire = wire_tot
# After-plan estimates (measured webp q80 where it wins, original where webp is worse)
after_images = {
    "bg-rainforest.webp": 116_850,
    "bg-teacher-clouds.webp": 89_414,
    "peta_lapisan_bumi.webp": 47_394,
    "radar_bumi_lengkap.webp": 54_564,
    "images.jpeg (keep)": 85_163,
    "wedhus_gembel.jpg (keep)": 25_827,
    "1.webp (keep)": 84_312,
}
after_img = sum(after_images.values())
# STL: keep as STL but served with gzip (measured) instead of Draco glTF
stl_raw, stl_gz = transfer(os.path.join(PUBLIC, "terrain-688.stl"))

print(f"precache wire today                 : {precache_wire:>12,} B")
print(f"on-demand wire today (STL+jpg)      : {od_wire:>12,} B")
print(f"COLD session today (wire)           : {precache_wire + od_wire:>12,} B "
      f"({(precache_wire+od_wire)/1024/1024:.2f} MiB)")
print(f"WARM session today (SW cache hit,   : {od_wire:>12,} B "
      f"({od_wire/1024/1024:.2f} MiB)")
print("  STL+images re-fetched: not precached, no explicit cache headers)")
print()
print(f"after: images as webp (measured)    : {after_img:>12,} B  (was {od_raw - stl_raw:,} B of jpg/webp)")
print(f"after: STL served gzip              : {stl_gz:>12,} B  (was {stl_raw:,} B)")
after_od = after_img + stl_gz
print(f"after: on-demand wire               : {after_od:>12,} B ({after_od/1024/1024:.2f} MiB)")
print(f"after: COLD session (precache + od) : {precache_wire + after_od:>12,} B "
      f"({(precache_wire+after_od)/1024/1024:.2f} MiB)  "
      f"[before asset pruning/defer of precache]")
print(f"after: WARM session (immutable)     : {'~0':>12}  B  (service worker + HTTP cache)")
print()
print("PER 1000 SESSIONS (wire bytes):")
print(f"  today, 1000 cold : {(precache_wire+od_wire)*1000/1e9:>8.2f} GB")
print(f"  today, 1000 warm : {od_wire*1000/1e9:>8.2f} GB")
print(f"  after, 1000 cold : {(precache_wire+after_od)*1000/1e9:>8.2f} GB")
print(f"  after, 1000 warm : {0:>8.2f} GB")
