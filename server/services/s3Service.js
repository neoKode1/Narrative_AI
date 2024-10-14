import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';  // Assuming you're using Node 14+

// Load environment variables
dotenv.config();

// Initialize S3 client with credentials from .env
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to S3
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} contentType - The content type of the file (e.g., 'image/png', 'audio/mpeg')
 * @param {string} fileName - The name to give the file in S3
 * @returns {string} The URL of the uploaded file in S3
 */
export const uploadToS3  = async (fileBuffer, contentType, fileName) => {
  const uniqueFileName = `${uuidv4()}-${fileName}`;  // Add unique identifier to the file name

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,   // Your S3 bucket name
    Key: uniqueFileName,                      // Unique file name in S3
    Body: fileBuffer,                         // File content (Buffer)
    ContentType: contentType,                 // MIME type of the file
    ACL: 'public-read',                       // Make the file publicly accessible
  };

  try {
    // Upload the file to S3
    const command = new PutObjectCommand(params);
    await s3.send(command);

    // Return the public URL of the uploaded file
    const s3FileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return s3FileUrl;
  } catch (err) {
    console.error('Error uploading file to S3:', err);
    throw new Error('Failed to upload file to S3');
  }
};
