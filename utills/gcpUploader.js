const { Storage } = require('@google-cloud/storage');
const fs = require('fs');

const path = require('path');

const keyFilename = path.join(__dirname, '../secrets/sonic-diorama-420610-157556ab6586.json');


console.log({ keyFilename });

const storage = new Storage({
  projectId: process.env.GCP_PROJECT_ID,
  keyFilename: keyFilename,
});

const bucketName = process.env.GCP_BUCKET_NAME;

async function uploadFile(file) {
  try {
    // Ensure that the required parameters are provided and valid
    if (!file || typeof file.filepath !== 'string') {
      throw new Error('Invalid file object or filepath');
    }

    const filePath = file.filepath;
    const originalFilename = file.originalFilename || 'default-filename';
    const mimeType = file.mimetype || 'application/octet-stream'; // default MIME type if not provided

    // Create a readable stream from the file path
    const fileStream = fs.createReadStream(filePath);

    // Determine destination filename based on the original filename and MIME type
    const destinationFileName = originalFilename;

    // Create a writable stream for uploading the file
    const uploadStream = storage.bucket(bucketName).file(destinationFileName).createWriteStream({
      metadata: {
        contentType: mimeType,
        cacheControl: 'public, max-age=31536000',
      },
    });

    // Pipe the file stream to the upload stream
    fileStream.pipe(uploadStream);

    // Wait for the upload to complete
    await new Promise((resolve, reject) => {
      uploadStream.on('error', reject);
      uploadStream.on('finish', resolve);
    });

    console.log(`${filePath} uploaded to ${bucketName} as ${destinationFileName}`);

    return `https://storage.cloud.google.com/${bucketName}/${destinationFileName}`
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

module.exports = { uploadFile };
