import fitz
import os

svg_sample = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="red"/><circle cx="100" cy="100" r="50" fill="yellow"/></svg>'
doc = fitz.open(stream=svg_sample.encode('utf-8'), filetype='svg')
page = doc[0]
pix = page.get_pixmap(dpi=150)
out_path = 'c:/github/lidm buatan vincent/test_svg_render.png'
pix.save(out_path)
print("Rendered:", os.path.exists(out_path))
