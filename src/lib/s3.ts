import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function uploadProfileImage(
  buffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const endpoint = process.env.S3_ENDPOINT || "https://s3-id-jkt-1.kilatstorage.id";
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "";
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || "";
  const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || "profile-waagateway";
  const region = process.env.S3_REGION || process.env.AWS_REGION || "us-east-1";

  const s3Client = new S3Client({
    endpoint,
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true, // Wajib true untuk S3-compatible seperti KilatStorage/Ceph
  });

  const cleanKey = `avatars/${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: cleanKey,
    Body: buffer,
    ContentType: contentType,
    ACL: "public-read", // Agar gambar dapat diakses secara publik
  });

  await s3Client.send(command);

  // URL Publik KilatStorage: https://s3-id-jkt-1.kilatstorage.id/profile-wagateway/avatars/...
  return `${endpoint}/${bucket}/${cleanKey}`;
}
