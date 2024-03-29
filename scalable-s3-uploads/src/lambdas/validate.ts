import { GetObjectCommand } from '@aws-sdk/client-s3';
import { S3Event, SQSHandler } from 'aws-lambda';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { s3 } from '../clients';
import { createGzip, generateId, upload, validatorTransform } from '../utils';

export const handler: SQSHandler = async (event) => {
  const failedMessageIds: string[] = [];

  const promises = event.Records.map(async (r) => {
    try {
      console.time('validation');
      const s3Evt: S3Event = JSON.parse(r.body);

      const bucketName = s3Evt.Records[0].s3.bucket.name;
      const objectKey = s3Evt.Records[0].s3.object.key;

      const { Body } = await s3.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: objectKey
        })
      );

      if (!Body) throw new Error('file does not exist');

      const gzip = createGzip();

      pipeline(
        Body as Readable,
        parse({ columns: true }),
        validatorTransform(),
        stringify({ header: true }),
        gzip
      ).catch((err) => {
        throw err;
      });

      await upload({
        bucket: bucketName,
        key: `validations/${generateId()}.csv.gz`,
        body: gzip
      });

      console.timeEnd('validation');
    } catch (err) {
      console.log(err);
      failedMessageIds.push(r.messageId);
    }
  });

  await Promise.allSettled(promises);
  return {
    batchItemFailures: failedMessageIds.map((id) => ({
      itemIdentifier: id
    }))
  };
};
