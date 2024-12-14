const fs = require('fs');

// Replace with your actual image file path
const imageLocation = '/home/tim_10/Downloads/photo_2024-07-15_02-04-41.jpg';

// Read the image file as a binary buffer
const imageBuffer = fs.readFileSync(imageLocation);

// Encode the image buffer to base64
const base64Image = imageBuffer.toString('base64');

console.log(base64Image);
