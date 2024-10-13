import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
const { v4: uuidv4 } = await import('uuid');



dotenv.config();

// Initialize S3 client with credentials from .env
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadImage = async (fileBuffer, contentType, fileName) => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME, // Your S3 bucket name
    Key: fileName,                          // Unique file name
    Body: fileBuffer,                       // File content (buffer from Hugging Face)
    ContentType: contentType,               // MIME type of the file
    ACL: 'public-read',                     // Make the file publicly readable
  };

  try {
    const command = new PutObjectCommand(params);
    await s3.send(command);

    const s3ImageUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return s3ImageUrl;
  } catch (err) {
    console.error('Error uploading image to S3:', err);
    throw new Error('Failed to upload image to S3');
  }
};
