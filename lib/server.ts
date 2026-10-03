import { getDb } from '../db/index';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

export function db(){ return getDb(); }

export function bucket(){
  const e = process.env as Record<string, string>;
  if(!e.S3_ACCESS_KEY_ID || !e.S3_SECRET_ACCESS_KEY || !e.S3_ENDPOINT || !e.S3_BUCKET_NAME) 
    throw new Error('Armazenamento S3 indisponível. Tente novamente.');
  
  const client = new S3Client({
    region: (e.S3_REGION as string) || "auto",
    endpoint: e.S3_ENDPOINT as string,
    credentials: {
      accessKeyId: e.S3_ACCESS_KEY_ID as string,
      secretAccessKey: e.S3_SECRET_ACCESS_KEY as string,
    },
  });

  return {
    async put(key: string, body: Uint8Array, options?: { httpMetadata?: { contentType?: string } }) {
      await client.send(new PutObjectCommand({
        Bucket: e.S3_BUCKET_NAME as string,
        Key: key,
        Body: body,
        ContentType: options?.httpMetadata?.contentType,
      }));
    },
    async get(key: string) {
      try {
        const result = await client.send(new GetObjectCommand({
          Bucket: e.S3_BUCKET_NAME as string,
          Key: key,
        }));
        if (!result.Body) return null;
        return {
          body: result.Body as any,
          arrayBuffer: async () => await result.Body?.transformToByteArray()
        };
      } catch (err: any) {
        if (err.name === 'NoSuchKey') return null;
        throw err;
      }
    },
    async delete(key: string) {
      await client.send(new DeleteObjectCommand({
        Bucket: e.S3_BUCKET_NAME as string,
        Key: key,
      }));
    }
  };
}

export function aiConfig(){const e=process.env as Record<string,string>;return {key:e.OPENAI_API_KEY as string,model:(e.OPENAI_MODEL as string)||'gpt-4.1-mini'};}
