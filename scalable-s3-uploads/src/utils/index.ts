import { Upload } from '@aws-sdk/lib-storage';
import { validate } from 'json-schema';
import { Readable, Transform } from 'node:stream';
import * as zlib from 'node:zlib';
import { s3 } from '../clients';
import { User, userSchema } from '../schemas';

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const validatorTransform = () => {
  return new Transform({
    objectMode: true,
    transform(user: User, _, callback) {
      try {
        const { valid, errors } = validate(userSchema, user);

        callback(null, {
          ...user,
          valid,
          ...(errors.length > 0 && {
            errors: errors.map((e) => e.message).join(', ')
          })
        });
      } catch (e: any) {
        callback(e);
      }
    }
  });
};

// NOTE: Keep in mind we're optmizing for speed and efficiency here.
export const createGzip = () => {
  return zlib.createGzip({
    // Reduce memory usage for compression, balancing speed and efficiency.
    memLevel: 7,
    // Flush data as soon as possible for real-time streaming.
    flush: zlib.constants.Z_SYNC_FLUSH,
    // Optimize for fastest compression speed over ratio.
    level: zlib.constants.Z_BEST_SPEED,
    // Use Huffman coding for quicker, simpler compression.
    strategy: zlib.constants.Z_HUFFMAN_ONLY
  });
};

interface MultipartUploadInput {
  bucket: string;
  key: string;
  body: Readable;
}

export const upload = async ({ bucket, key, body }: MultipartUploadInput) => {
  const parallelUploads3 = new Upload({
    client: s3,
    params: { Bucket: bucket, Key: key, Body: body },
    queueSize: 4, // optional concurrency limit, default is 4.
    partSize: 1024 * 1024 * 5, // optional size of each part, in bytes, at least 5MB.
    leavePartsOnError: false
  });

  parallelUploads3.on('httpUploadProgress', (progress) => {
    console.log(progress);
  });

  await parallelUploads3.done();
};
