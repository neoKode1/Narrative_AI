import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: process.env.GCLOUD_KEYFILE_PATH, // Load from environment variable
  projectId: process.env.GCLOUD_PROJECT_ID,
});

const bucketName = process.env.GCLOUD_BUCKET_NAME;
const bucket = storage.bucket(bucketName);

// Function to upload files to GCS
export const uploadToGCS = async (fileBuffer, contentType) => {
  const fileName = `${uuidv4()}-generated-file.png`;
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
    throw new Error('Failed to upload file to Google Cloud Storage');
  }
};
