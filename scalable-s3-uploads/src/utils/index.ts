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
        const { errors } = validate(userSchema, user);

        callback(null, {
          ...user,
          valid: errors.length === 0,
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

export const createGzip = () => {
  return zlib.createGzip({
    flush: zlib.constants.Z_SYNC_FLUSH, // See http://www.zlib.net/manual.html#Advanced
    level: zlib.constants.Z_BEST_SPEED
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
