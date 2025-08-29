import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import dotenv from "dotenv";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

dotenv.config();

// Initialize Toast
toast.configure();

// Configure S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadFileToS3(localFilePath, s3FileName) {
  try {
    // Check if file exists
    if (!fs.existsSync(localFilePath)) {
      toast.error("File does not exist: " + localFilePath);
      return;
    }

    const fileStream = fs.createReadStream(localFilePath);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: s3FileName,
      Body: fileStream,
    };

    const result = await s3.send(new PutObjectCommand(uploadParams));

    toast.success(`File uploaded successfully: ${s3FileName}`);
    console.log("Upload result:", result);

    return result;
  } catch (err) {
    console.error("Error uploading file:", err);
    toast.error("Failed to upload file: " + err.message);
    throw err;
  }
}
