from PIL import Image, ImageFilter
import math

img_path = r"d:\androhack\WhatsApp Image 2026-09-12 at 7.18.57 PM.jpeg"
img = Image.open(img_path).convert("RGBA")

width, height = img.size
pixels = img.load()

# Create clean output canvas
clean_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
clean_pixels = clean_img.load()

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        
        # Check intensity of blue channel relative to red/green
        # The artwork is blue (B > R and B > G)
        blue_signal = b - max(r, g)
        brightness = (r + g + b) / 3.0
        
        # Filter out black background and light white edge halos
        # If it's a true blue stroke pixel
        if b > 70 and blue_signal > 15:
            # Clean blue color without white noise
            # Boost blue and purple tones to match the website theme
            norm_b = min(255, b + 20)
            norm_r = int(norm_b * 0.35)
            norm_g = int(norm_b * 0.55)
            clean_pixels[x, y] = (norm_r, norm_g, norm_b, 255)
        elif b > 140 and (r > 120 and g > 120):
            # Border edge pixel: map to vibrant blue-purple gradient tint with partial alpha
            alpha_val = int(min(255, (b - 80) * 1.5))
            if alpha_val > 40:
                clean_pixels[x, y] = (90, 140, 245, alpha_val)

# Perform edge smoothing using sub-pixel blur + alpha threshold masking
alpha = clean_img.split()[3]
smoothed_alpha = alpha.filter(ImageFilter.GaussianBlur(0.8))

r, g, b, _ = clean_img.split()
final_img = Image.merge("RGBA", (r, g, b, smoothed_alpha))

# Save enhanced transparent PNG
final_img.save(r"d:\androhack\public\hero_avatar.png", "PNG")
print("Vector edge enhancement completed successfully!")
