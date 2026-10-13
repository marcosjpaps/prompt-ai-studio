-- Banco opcional de arquivos pequenos, no Neon, quando S3 não está disponível.
CREATE TABLE IF NOT EXISTS "image_blobs" (
  "key" text PRIMARY KEY NOT NULL,
  "data" bytea NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now()
);
