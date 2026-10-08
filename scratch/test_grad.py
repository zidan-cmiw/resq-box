import pymupdf as fitz

for test, name in [
    ('<linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="red"/><stop offset="1" stop-color="yellow"/></linearGradient>', 'std'),
    ('<linearGradient id="g1" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:red;"/><stop offset="100%" style="stop-color:yellow;"/></linearGradient>', 'style'),
    ('<linearGradient id="g1" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100"><stop offset="0" stop-color="red"/><stop offset="1" stop-color="yellow"/></linearGradient>', 'userSpace')
]:
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><defs>{test}</defs><rect width="100" height="100" fill="url(#g1)"/></svg>'
    doc = fitz.open(stream=svg.encode('utf-8'), filetype='svg')
    pix = doc[0].get_pixmap()
    pix.save(f'c:/github/lidm buatan vincent/RESQ-BOX/scratch/test_grad_{name}.png')
    print(name, 'saved, pixel 50,50:', pix.pixel(50, 50))
