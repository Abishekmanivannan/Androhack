from PIL import Image, ImageFilter
import math

img_path = r"d:\androhack\WhatsApp Image 2026-09-12 at 7.18.57 PM.jpeg"
img = Image.open(img_path).convert("RGBA")

width, height = img.size
pixels = img.load()

# Create clean logo image
clean_img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
clean_pixels = clean_img.load()

# Target blue logo color
TARGET_BLUE = (80, 130, 235)

for y in range(height):
    for x in range(width):
        r, g, b, a = pixels[x, y]
        
        # Check if black background
        if r < 35 and g < 35 and b < 35:
            clean_pixels[x, y] = (0, 0, 0, 0)
            continue
            
        # Calculate saturation / blue dominance
        # Pure white/gray fringe pixels have low difference between R, G, B
        max_c = max(r, g, b)
        min_c = min(r, g, b)
        sat = (max_c - min_c) / max_c if max_c > 0 else 0
        
        # If it's a white fringe halo (high brightness, low saturation)
        if sat < 0.35 and max_c > 140:
            # Replace white fringe with clean vibrant blue logo tint
            alpha_val = int(255 * (max_c / 255.0))
            clean_pixels[x, y] = (TARGET_BLUE[0], TARGET_BLUE[1], TARGET_BLUE[2], alpha_val)
        else:
            # Keep logo pixel, boosting blue purity if needed
            # Remove any residual white tinting
            blue_boost_r = int(r * 0.75)
            blue_boost_g = int(g * 0.85)
            blue_boost_b = max(b, 220)
            clean_pixels[x, y] = (blue_boost_r, blue_boost_g, blue_boost_b, 255)

# Smooth edges with alpha channel feathering
alpha = clean_img.split()[3]
smoothed_alpha = alpha.filter(ImageFilter.GaussianBlur(1.2))

# Re-apply smoothed alpha
r, g, b, _ = clean_img.split()
final_img = Image.merge("RGBA", (r, g, b, smoothed_alpha))

# Save enhanced transparent PNG
final_img.save(r"d:\androhack\public\hero_avatar.png", "PNG")
print("Cleaned edges and saved enhanced logo PNG successfully!")
