import axios from 'axios';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';


 // For generating unique filenames

// Hugging Face API URL for Flux 1 model
const API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

// Authorization token (replace with your actual token)
const headers = {
  "Authorization": "Bearer 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" // Your Hugging Face token here
};

// Initialize AWS S3 client with credentials from environment variables
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const generateImage = async (prompt) => {
  try {
    // Send POST request to Hugging Face API with the prompt
    const response = await axios.post(
      API_URL,
      { "inputs": prompt },  // Ensure the prompt is sent as a plain string
      {
        headers: headers,
        responseType: 'arraybuffer',  // Expect the response as binary data (an image)
      }
    );

    // Log the response status for debugging purposes
    console.log("Response status from Hugging Face API:", response.status);

    // Get the image data and MIME type
    const imageBuffer = response.data;
    const contentType = response.headers['content-type']; // Get content type (like image/png or image/jpeg)

    // Generate a unique image name for S3
    const imageName = `${uuidv4()}-generated-image.png`;

    // Define the S3 upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME, // S3 bucket name
      Key: imageName,                         // Unique file name
      Body: imageBuffer,                      // File content (buffer)
      ContentType: contentType,               // MIME type of the file
      ACL: 'public-read',                     // Make the file publicly readable
    };

    // Upload the image buffer to S3
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Generate the S3 public URL
    const s3ImageUrl = `https://${uploadParams.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;

    // Return the S3 image URL
    return s3ImageUrl;

  } catch (error) {
    console.error('Error generating or uploading image:', error.message);
    console.error('Error response:', error.response ? error.response.data : 'undefined');
    throw new Error('Failed to generate image');
  }
};
