"""Throwaway measurement helper (in-memory only, writes nothing but this table).

Measures real pixel dimensions and real achievable WebP sizes for the assets in
RESQ-BOX/public so the capacity/asset strategy quotes verified numbers instead
of guesses. Run:
    python _measure_assets.py
"""
import io
import json
import os
import sys

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
    "1.webp",
    "images.jpeg",
    "images (1).jpg",
    "wedhus_gembel.jpg",
    "lahar_dingin.jpg",
    "frames/f_0.jpg",
    "frames/f_3.jpg",
    "frames/f_6.jpg",
]

print("pillow", Image.__version__, "| webp:", features.check("webp"), "| avif:", features.check("avif"))
print()

rows = []
for rel in TARGETS:
    path = os.path.join(PUBLIC, rel.replace("/", os.sep))
    if not os.path.exists(path):
        print("MISSING", rel)
        continue
    orig = os.path.getsize(path)
    with Image.open(path) as im:
        w, h = im.size
        fmt = im.format
        im.load()
        # convert to RGB for lossy webp (drop alpha only when fully opaque)
        base = im.convert("RGBA" if (im.mode in ("RGBA", "LA", "P") and "transparency" in im.info) else "RGB")
        out = {}
        for q in (90, 80, 70):
            buf = io.BytesIO()
            base.save(buf, format="WEBP", quality=q, method=6)
            out[q] = buf.tell()
        # also measure a resize-to-half variant at q=80 when the image is oversized
        half = None
        if w >= 1600:
            buf = io.BytesIO()
            base.resize((w // 2, h // 2), Image.LANCZOS).save(buf, format="WEBP", quality=80, method=6)
            half = buf.tell()
    rows.append(
        dict(
            file=rel,
            fmt=fmt,
            w=w,
            h=h,
            bytes=orig,
            webp90=out[90],
            webp80=out[80],
            webp70=out[70],
            webp80_half=half,
        )
    )

hdr = f"{'file':38} {'fmt':5} {'WxH':>12} {'orig':>10} {'webp90':>9} {'webp80':>9} {'webp70':>9} {'half80':>9} {'save80%':>8}"
print(hdr)
print("-" * len(hdr))
for r in rows:
    save = 100.0 * (1 - r["webp80"] / r["bytes"])
    print(
        f"{r['file']:38} {r['fmt']:5} {str(r['w'])+'x'+str(r['h']):>12} "
        f"{r['bytes']:>10,} {r['webp90']:>9,} {r['webp80']:>9,} {r['webp70']:>9,} "
        f"{(r['webp80_half'] or 0):>9,} {save:>7.1f}%"
    )

tot = sum(r["bytes"] for r in rows)
tot80 = sum(r["webp80"] for r in rows)
print()
print(f"measured originals total : {tot:,} bytes")
print(f"at webp q80 total        : {tot80:,} bytes  (save {100*(1-tot80/tot):.1f}%)")

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "_measure_assets.json"), "w") as fh:
    json.dump(rows, fh, indent=1)
print("json ->", "_measure_assets.json")
