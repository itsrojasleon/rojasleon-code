import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Event, SQSHandler } from 'aws-lambda';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { PassThrough, Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { s3 } from '../clients';
import { createGzip, generateId, validatorTransform } from '../utils';

export const handler: SQSHandler = async (event) => {
  const failedMessageIds: string[] = [];

  const promises = event.Records.map(async (r) => {
    try {
      const s3Evt: S3Event = JSON.parse(r.body);

      const bucketName = s3Evt.Records[0].s3.bucket.name;
      const objectKey = s3Evt.Records[0].s3.object.key;

      const cmd = new GetObjectCommand({ Bucket: bucketName, Key: objectKey });
      const { Body } = await s3.send(cmd);

      if (!Body) throw new Error('file does not exist');

      const out = new PassThrough();

      await pipeline(
        Body as Readable,
        parse({ columns: true }),
        validatorTransform(),
        stringify({ header: true }),
        createGzip(),
        out
      );

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `/validations/${generateId()}.csv.gz`,
          Body: out
        })
      );
    } catch (e) {
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
