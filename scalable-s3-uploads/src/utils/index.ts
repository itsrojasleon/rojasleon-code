import { validate } from 'json-schema';
import { Transform } from 'node:stream';
import * as zlib from 'node:zlib';
import { Order, orderSchema } from '../schemas';

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

type UnformattedOrder = Omit<Order, 'items' | 'paymentInfo'> & {
  items: string;
  paymentInfo: string;
};

export const validatorTransform = () => {
  return new Transform({
    objectMode: true,
    transform(chunk: UnformattedOrder, _, callback) {
      try {
        const order = {
          ...chunk,
          items: JSON.parse(chunk.items),
          paymentInfo: JSON.parse(chunk.paymentInfo)
        };

        const { errors } = validate(orderSchema, order);

        callback(null, {
          ...order,
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
