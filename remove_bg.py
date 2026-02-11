from PIL import Image

# Open the image
img = Image.open('src/assets/logo3.png')

# Convert to RGBA if not already
img = img.convert('RGBA')

# Resize to smaller size (half the size)
new_width = int(img.width * 0.5)
new_height = int(img.height * 0.5)
img = img.resize((new_width, new_height), Image.LANCZOS)

# Get the data
data = img.getdata()

print("First 10 pixels:")
for i in range(10):
    print(data[i])

# Create a new list for the data
new_data = []
changed_pixels = 0

# Loop through each pixel
for item in data:
    # If the pixel is blue (high blue, low red and green), make it white
    if item[2] > 150 and item[0] < 100 and item[1] < 100:  # Adjusted thresholds
        new_data.append((255, 255, 255, 255))  # White
        changed_pixels += 1
    else:
        new_data.append(item)

# Put the new data back
img.putdata(new_data)

# Set DPI for improved resolution
img.info['dpi'] = (300, 300)

# Save the image
img.save('src/assets/logo3.png', 'PNG')

print(f"Total pixels: {len(data)}")
print(f"Changed pixels: {changed_pixels}")
