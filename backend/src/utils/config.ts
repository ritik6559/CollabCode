import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL = process.env.DATABASE_URL!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

// S3 content storage
export const S3_BUCKET = process.env.S3_BUCKET!;
export const AWS_REGION = process.env.AWS_REGION || "ap-south-1";
/** Optional — set to use MinIO/LocalStack in local dev. */
export const S3_ENDPOINT = process.env.S3_ENDPOINT;
