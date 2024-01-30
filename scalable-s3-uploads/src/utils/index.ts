import { validate } from 'json-schema';
import { Transform } from 'node:stream';
import * as zlib from 'node:zlib';
import { User, userSchema } from '../schemas';

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
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
    flush: zlib.constants.Z_SYNC_FLUSH // See http://www.zlib.net/manual.html#Advanced
  });
};
