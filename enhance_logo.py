from PIL import Image, ImageFilter

# Open the image
img = Image.open('src/assets/logo4.png')

# Ensure it's in RGBA mode to preserve transparency
img = img.convert('RGBA')

# Reduce noise using a median filter
img = img.filter(ImageFilter.MedianFilter(size=3))

# Enhance sharpness and edges using Unsharp Mask
img = img.filter(ImageFilter.UnsharpMask(radius=1, percent=150, threshold=3))

# Optionally, enhance contrast slightly if needed, but keep colors natural
# For now, skip to maintain natural colors

# Save the enhanced image, overwriting the original
img.save('src/assets/logo4.png')

print("Image enhanced successfully.")
