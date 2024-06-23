const AWS = require('aws-sdk');
const formidable = require('formidable');
const fs = require('fs');

// Configure AWS with your credentials
AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: process.env.REGION
});

// Create S3 instance
const s3 = new AWS.S3();

// Handle file upload
const uploadFileToS3 = (file) => {

  console.log({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
    bucket: process.env.BUCKET_NAME
  });

  const fileName = file.originalFilename;
  const mimeType = file.mimeType;
  const fileStream = fs.createReadStream(file.filepath);

  // console.log({fileStream});
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
    Body: fileStream,
    mimeType,
    ACL: 'public-read' // Adjust the access control as needed
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Location); // URL of the uploaded file
      }
    });
  });
};

module.exports={uploadFileToS3}
