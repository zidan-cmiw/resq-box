"""Third pass: measure gzip/brotli on terrain-688.stl and confirm STL structure.

Read-only: opens files, writes nothing except stdout. The binary STL header is
84 bytes (80-byte header + uint32 triangle count) followed by 50 bytes/triangle.
"""
import gzip
import os
import struct
import zlib

BASE = os.path.dirname(os.path.abspath(__file__))
PUBLIC = os.path.join(BASE, "..", "public")
DIST = os.path.join(BASE, "..", "dist")

stl = os.path.join(PUBLIC, "terrain-688.stl")
size = os.path.getsize(stl)
with open(stl, "rb") as fh:
    data = fh.read()

tri = struct.unpack("<I", data[80:84])[0]
print(f"STL file            : {size:,} bytes")
print(f"declared triangles  : {tri:,}")
print(f"expected size (84+50n): {84 + 50*tri:,} bytes  -> exact match: {84 + 50*tri == size}")
print()

gz = gzip.compress(data, 9)
print(f"gzip -9             : {len(gz):,} bytes  ({100*(1-len(gz)/size):.1f}% smaller)")
try:
    import brotli  # type: ignore
    br = brotli.compress(data, quality=11)
    print(f"brotli q11          : {len(br):,} bytes  ({100*(1-len(br)/size):.1f}% smaller)")
except Exception as exc:  # noqa: BLE001
    print(f"brotli              : module not available ({exc.__class__.__name__}) - not measured")
print()

# Cross-check text assets already delivered compressed by the host.
for rel in [
    ("assets", "index-CLnlKFEU.js"),
    ("assets", "index-DE2V3StC.css"),
    ("assets", "blockly-BpR8KDA3.js"),
]:
    p = os.path.join(DIST, *rel)
    if not os.path.exists(p):
        print("missing", p)
        continue
    raw = open(p, "rb").read()
    print(
        f"{rel[1]:30} raw {len(raw):>9,}  gzip {len(gzip.compress(raw, 9)):>9,}  "
        f"zlib {len(zlib.compress(raw, 9)):>9,}"
    )
