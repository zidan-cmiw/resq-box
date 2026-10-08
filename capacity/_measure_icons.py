"""Fifth pass: measure right-sized icon variants for the mislabelled 1024x1024 logo.

public/logo.png is actually a JPEG (magic FF D8 FF) at 1024x1024 / 367,842 bytes,
declared as type="image/png" in index.html:5. Measure real replacement sizes.
In-memory only.
"""
import io
import os
from PIL import Image

PUBLIC = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public"))
src = os.path.join(PUBLIC, "logo.png")
print("source:", src)
with open(src, "rb") as fh:
    print("magic:", fh.read(4).hex(), "(ffd8ff = JPEG)")
print("bytes:", f"{os.path.getsize(src):,}")
with Image.open(src) as im:
    print("size :", im.size, "format:", im.format)
    im.load()
    rgb = im.convert("RGB")

    def png(size, colors=None, optimize=True):
        buf = io.BytesIO()
        kw = {"optimize": optimize}
        if colors:
            kw["colors"] = colors
        rgb.resize(size, Image.LANCZOS).save(buf, format="PNG", **kw)
        return buf.tell()

    def webp(size, q=80):
        buf = io.BytesIO()
        rgb.resize(size, Image.LANCZOS).save(buf, format="WEBP", quality=q, method=6)
        return buf.tell()

    print()
    print(f"{'variant':38} {'bytes':>9}  {'vs 367,842':>10}")
    print("-" * 62)
    for label, n in [
        ("favicon 192x192 PNG-256", png((192, 192), 256)),
        ("favicon 192x192 PNG truecolor", png((192, 192))),
        ("apple-touch 180x180 PNG-256", png((180, 180), 256)),
        ("pwa 192x192 PNG-256", png((192, 192), 256)),
        ("pwa 512x512 PNG-256", png((512, 512), 256)),
        ("pwa 512x512 PNG truecolor", png((512, 512))),
        ("512x512 webp q80", webp((512, 512))),
    ]:
        print(f"{label:38} {n:>9,}  {100*(1-n/367842):>9.1f}%")

    total = png((192, 192), 256) + png((180, 180), 256) + png((512, 512), 256)
    print("-" * 62)
    print(f"{'192 + 180 + 512 (all three, PNG-256)':38} {total:>9,}  {100*(1-total/367842):>9.1f}%")
    print()
    print("note: public/pwa-192x192.png and public/pwa-512x512.png DO NOT EXIST")
    print("      (verified) yet manifest + index.html reference them -> 404 today.")
