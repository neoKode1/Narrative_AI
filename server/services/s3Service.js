import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the parent directory of the server folder
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

// Initialize S3 client with credentials from .env
const s3 = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const uploadToS3 = async (fileBuffer, contentType, fileName) => {
  const uniqueFileName = `${uuidv4()}-${fileName}`;
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  if (!bucketName) {
    throw new Error('AWS_S3_BUCKET_NAME is not set in environment variables');
  }

  const params = {
    Bucket: bucketName,
    Key: uniqueFileName,
    Body: fileBuffer,
    ContentType: contentType,
  };

  try {
    console.log('Uploading to S3 with params:', {
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: params.Bucket,
      key: params.Key,
      contentType: params.ContentType
    });

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const s3FileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${params.Key}`;
    console.log('File uploaded successfully to:', s3FileUrl);
    return s3FileUrl;
  } catch (err) {
    console.error('Error uploading file to S3:', err);
    throw new Error(`Failed to upload file to S3: ${err.message}`);
  }
};