import {
    S3Client,
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { AWS_REGION, S3_BUCKET, S3_ENDPOINT } from "../../utils/config";

export const s3 = new S3Client({
    region: AWS_REGION,
    // MinIO/LocalStack need an explicit endpoint + path-style addressing
    ...(S3_ENDPOINT ? { endpoint: S3_ENDPOINT, forcePathStyle: true } : {}),
});

/** Returns null when the object doesn't exist (a normal case, not an error). */
export const getObjectBytes = async (key: string): Promise<Buffer | null> => {
    try {
        const res = await s3.send(new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }));
        const bytes = await res.Body?.transformToByteArray();
        return bytes ? Buffer.from(bytes) : null;
    } catch (e) {
        const name = (e as { name?: string }).name;
        if (name === "NoSuchKey" || name === "NotFound") {
            return null;
        }
        throw e;
    }
};

export const putObjectBytes = async (key: string, body: Buffer, contentType: string) => {
    await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: key,
        Body: body,
        ContentType: contentType,
    }));
};

export const deleteObjects = async (keys: string[]) => {
    if (keys.length === 0) return;
    await s3.send(new DeleteObjectsCommand({
        Bucket: S3_BUCKET,
        Delete: { Objects: keys.map((Key) => ({ Key })) },
    }));
};
