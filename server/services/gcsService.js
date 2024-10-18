import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const storage = new Storage({
  keyFilename: path.join(process.cwd(), 'path/to/your-service-account-key.json'),
  projectId: 'your-project-id',
});

const bucketName = 'your-bucket-name';
const bucket = storage.bucket(bucketName);

export const uploadToGCS = async (fileBuffer, contentType) => {
  const fileName = `${uuidv4()}-generated-image.png`;
  const file = bucket.file(fileName);

  try {
    await file.save(fileBuffer, {
      metadata: { contentType },
    });

    await file.makePublic();

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Google Cloud Storage:', error);
    throw new Error('Failed to upload image to Google Cloud Storage');
  }
};