from PIL import Image
import os

# Load transparent logo icon
icon_path = r"d:\androhack\public\logo_icon.png"
img = Image.open(icon_path).convert("RGBA")

# 1. Save icon.png to src/app/
img.save(r"d:\androhack\src\app\icon.png", "PNG")

# 2. Save favicon.ico to public/ and src/app/
# Make 32x32 and 64x64 sizes for ICO format
img_32 = img.resize((32, 32), Image.Resampling.LANCZOS)
img_32.save(r"d:\androhack\public\favicon.ico", format="ICO", sizes=[(32, 32), (64, 64)])
img_32.save(r"d:\androhack\src\app\favicon.ico", format="ICO", sizes=[(32, 32), (64, 64)])

print("Favicon updated successfully across src/app/icon.png, public/favicon.ico, and src/app/favicon.ico!")
