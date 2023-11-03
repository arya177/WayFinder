import cv2
import numpy as np
# from google.colab import files

# Load the image
image_path = 'temp.png'  # Replace with the path to your image
image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)  # Convert the image to grayscale

# Threshold the image to create a binary image
_, binary_image = cv2.threshold(image, 128, 255, cv2.THRESH_BINARY)
# Calculate the desired shape for one pixel (32x32)
desired_pixel_shape = (32, 32)

# Calculate the shape of the resized image
desired_shape = (
    binary_image.shape[0] // desired_pixel_shape[0],
    binary_image.shape[1] // desired_pixel_shape[1]
)
# Resize the binary image to 40 columns and 23 rows
desired_shape = (100, 60)
resized_image = cv2.resize(binary_image, desired_shape, interpolation=cv2.INTER_AREA)

# Manually threshold the resized image to ensure values are 0 or 1
_, resized_binary_image = cv2.threshold(resized_image, 128, 255, cv2.THRESH_BINARY)

# Convert the resized binary image to a NumPy array of 0s and 1s
binary_array = resized_binary_image / 255  # Divide by 255 to convert 255 to 1

# Save the binary array to a text file
with open('binary_array.txt', 'w') as file:
    for row in binary_array:
        row_str = ' '.join(map(str, row))
        file.write(row_str + '\n')

# Optionally, save the resized binary image as a file
cv2.imwrite('resized_binary_image.png', resized_binary_image)

# Display the resized binary image (optional)
from matplotlib import pyplot as plt
plt.imshow(resized_binary_image, cmap='gray')
plt.axis('off')
plt.show()