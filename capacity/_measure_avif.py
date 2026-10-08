"""Second pass: AVIF sizes + magic-byte check (in-memory, read-only)."""
import io
import os
from PIL import Image, features

PUBLIC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public")

TARGETS = [
    "bg-rainforest.jpg",
    "bg-teacher-clouds.jpg",
    "peta_lapisan_bumi.jpg",
    "radar_bumi_lengkap.jpg",
    "radar_bumi_lengkap_label.png",
    "logo.png",
    "radar_bumi.png",
    "frames/f_0.jpg",
    "frames/f_3.jpg",
    "frames/f_6.jpg",
]

print("avif support:", features.check("avif"))
print()

def magic(path):
    with open(path, "rb") as fh:
        head = fh.read(12)
    if head[:3] == b"\xff\xd8\xff":
        return "JPEG (FF D8 FF)"
    if head[:8] == b"\x89PNG\r\n\x1a\n":
        return "PNG (89 50 4E 47)"
    if head[:4] == b"RIFF" and head[8:12] == b"WEBP":
        return "WEBP (RIFF....WEBP)"
    return "other " + head[:4].hex()

hdr = f"{'file':34} {'magic':20} {'orig':>9} {'avif60':>9} {'avif50':>9} {'avif40':>9} {'saving60%':>9}"
print(hdr)
print("-" * len(hdr))
rows = []
for rel in TARGETS:
    path = os.path.join(PUBLIC, rel.replace("/", os.sep))
    orig = os.path.getsize(path)
    with Image.open(path) as im:
        im.load()
        base = im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")
        sizes = {}
        for q in (60, 50, 40):
            buf = io.BytesIO()
            base.save(buf, format="AVIF", quality=q)
            sizes[q] = buf.tell()
    m = magic(path)
    rows.append((rel, m, orig, sizes))
    print(f"{rel:34} {m:20} {orig:>9,} {sizes[60]:>9,} {sizes[50]:>9,} {sizes[40]:>9,} {100*(1-sizes[60]/orig):>8.1f}%")

print()
tot = sum(r[2] for r in rows)
tot60 = sum(r[3][60] for r in rows)
print(f"originals            : {tot:,}")
print(f"avif q60             : {tot60:,}  (save {100*(1-tot60/tot):.1f}%)")
