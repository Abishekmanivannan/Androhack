from PIL import Image

img_path = r"d:\androhack\WhatsApp Image 2026-09-12 at 6.12.46 PM.jpeg"
img = Image.open(img_path).convert("RGBA")

datas = img.getdata()
newData = []

for item in datas:
    r, g, b, a = item
    # Check if pixel is light background (high lightness, whitish-blue)
    if r > 190 and g > 200 and b > 215:
        # Change white/light background to dark website color #120e24 or transparent
        # Make transparent for seamless blending with any website container
        newData.append((18, 14, 36, 0))
    else:
        # Keep original blue logo pixel
        newData.append((r, g, b, 255))

img.putdata(newData)    
img.save(r"d:\androhack\public\hero_avatar.png", "PNG")

# Also create a version pre-blended with #120e24 background
blended = Image.new("RGBA", img.size, (18, 14, 36, 255))
blended.paste(img, (0, 0), img)
blended.convert("RGB").save(r"d:\androhack\public\hero_avatar_blended.jpg", "JPEG")

print("Created transparent PNG and blended JPEG successfully!")
