from PIL import Image, ImageFilter
import math
import os

# Input image path
img_path = r"d:\androhack\WhatsApp Image 2026-09-12 at 6.12.46 PM.jpeg"
img = Image.open(img_path).convert("RGBA")

width, height = img.size
pixels = img.load()

# Background color in the raw image is around light bluish white (RGB ~ 240, 245, 255)
# Target logo color is vibrant blue (RGB ~ 70, 120, 240)

# Create transparent image
transparent_logo = Image.new("RGBA", (width, height), (0, 0, 0, 0))
t_pixels = transparent_logo.load()

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        
        # Calculate distance from background color (light bluish white: R>215, G>225, B>240)
        # Using luminance & saturation to distinguish background from blue logo
        bg_diff = (255 - r) * 0.3 + (255 - g) * 0.3 + (255 - b) * 0.4
        
        if r > 210 and g > 220 and b > 235:
            # Background pixel -> fully transparent
            t_pixels[x, y] = (0, 0, 0, 0)
        else:
            # Logo pixel or edge fringe
            # Compute alpha based on how non-background it is
            alpha_calc = min(255, int(bg_diff * 4.5))
            if alpha_calc < 15:
                t_pixels[x, y] = (0, 0, 0, 0)
            else:
                # Enhance logo blue color intensity so it pops on dark background (#0B0F19)
                # Keep original hue but boost vibrant blue saturation & brightness
                new_r = int(r * 0.6)
                new_g = int(g * 0.75)
                new_b = min(255, int(b * 1.15) + 20)
                t_pixels[x, y] = (new_r, new_g, new_b, alpha_calc)

# Smooth edges slightly using GaussianBlur on alpha
r, g, b, alpha = transparent_logo.split()
smoothed_alpha = alpha.filter(ImageFilter.GaussianBlur(0.6))
final_logo = Image.merge("RGBA", (r, g, b, smoothed_alpha))

# Save transparent logo to public folder
os.makedirs(r"d:\androhack\public", exist_ok=True)
final_logo.save(r"d:\androhack\public\logo.png", "PNG")
final_logo.save(r"d:\androhack\public\hero_avatar.png", "PNG")

# Also crop tightly around the logo graphic to make a square icon version
bbox = final_logo.getbbox()
if bbox:
    # Add small padding
    pad = 20
    x1 = max(0, bbox[0] - pad)
    y1 = max(0, bbox[1] - pad)
    x2 = min(width, bbox[2] + pad)
    y2 = min(height, bbox[3] + pad)
    
    cropped = final_logo.crop((x1, y1, x2, y2))
    
    # Make square aspect ratio
    c_w, c_h = cropped.size
    max_dim = max(c_w, c_h)
    square_img = Image.new("RGBA", (max_dim, max_dim), (0, 0, 0, 0))
    offset = ((max_dim - c_w) // 2, (max_dim - c_h) // 2)
    square_img.paste(cropped, offset)
    
    square_img.save(r"d:\androhack\public\logo_icon.png", "PNG")

print("Processed and saved official website logo transparent PNGs successfully!")
