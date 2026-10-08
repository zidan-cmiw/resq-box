import subprocess
import os

edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
out_img = r"c:\github\lidm buatan vincent\test_screenshot.png"

res = subprocess.run([
    edge_path,
    "--headless",
    "--disable-gpu",
    f"--screenshot={out_img}",
    "--window-size=400,500",
    "https://example.com"
], capture_output=True, text=True)

print("Return code:", res.returncode)
print("File exists:", os.path.exists(out_img))
