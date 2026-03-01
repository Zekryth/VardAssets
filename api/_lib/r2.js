import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Cloudflare R2 Client
let s3Client = null;

/**
 * Get configured S3 client for Cloudflare R2
 */
export function getR2Client() {
  if (!s3Client) {
    const accountId = process.env.CF_ACCOUNT_ID;
    const accessKeyId = process.env.R2_ACCESS_KEY_ID;
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

    if (!accountId || !accessKeyId || !secretAccessKey) {
      throw new Error('R2 credentials not configured. Required: CF_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY');
    }

    s3Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      forcePathStyle: true, // Required for Cloudflare R2
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }
  return s3Client;
}

/**
 * Upload a file to R2
 * @param {string} key - Path/filename in bucket
 * @param {Buffer} body - File content
 * @param {string} contentType - MIME type
 * @returns {Promise<{url: string, key: string}>}
 */
export async function uploadToR2(key, body, contentType) {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME || 'vardassets-files';
  const publicUrl = process.env.R2_PUBLIC_URL;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await client.send(command);

  // Return public URL
  const url = publicUrl 
    ? `${publicUrl.replace(/\/$/, '')}/${key}`
    : `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucket}/${key}`;

  return {
    url,
    key,
    bucket,
  };
}

/**
 * Delete a file from R2
 * @param {string} key - Path/filename in bucket
 * @returns {Promise<void>}
 */
export async function deleteFromR2(key) {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME || 'vardassets-files';

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

/**
 * Delete file by URL (extracts key from URL)
 * @param {string} url - Public URL of the file
 * @returns {Promise<void>}
 */
export async function deleteFromR2ByUrl(url) {
  const publicUrl = process.env.R2_PUBLIC_URL;
  
  // Extract key from URL
  let key;
  if (publicUrl && url.startsWith(publicUrl)) {
    key = url.replace(publicUrl.replace(/\/$/, '') + '/', '');
  } else {
    // Try to extract from S3-style URL
    const match = url.match(/r2\.cloudflarestorage\.com\/[^/]+\/(.+)/);
    if (match) {
      key = match[1];
    } else {
      // Last resort: get everything after the domain
      const urlObj = new URL(url);
      key = urlObj.pathname.replace(/^\//, '');
    }
  }

  if (!key) {
    throw new Error(`Cannot extract key from URL: ${url}`);
  }

  await deleteFromR2(key);
}

/**
 * List files in R2 with optional prefix
 * @param {string} prefix - Path prefix to filter
 * @returns {Promise<Array<{key: string, size: number, lastModified: Date}>>}
 */
export async function listFilesInR2(prefix = '') {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME || 'vardassets-files';
  const publicUrl = process.env.R2_PUBLIC_URL;

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  const response = await client.send(command);

  return (response.Contents || []).map(item => ({
    key: item.Key,
    size: item.Size,
    lastModified: item.LastModified,
    url: publicUrl 
      ? `${publicUrl.replace(/\/$/, '')}/${item.Key}`
      : `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucket}/${item.Key}`,
  }));
}
