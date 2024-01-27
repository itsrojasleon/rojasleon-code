import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { S3Event, SQSHandler } from 'aws-lambda';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { s3 } from '../clients';
import { createGzip, validatorTransform } from '../utils';

export const handler: SQSHandler = async (event) => {
  const failedMessageIds: string[] = [];

  const promises = event.Records.map(async (r) => {
    try {
      const s3Event: S3Event = JSON.parse(r.body);

      const bucketName = s3Event.Records[0].s3.bucket.name;
      const objectKey = s3Event.Records[0].s3.object.key;

      const { Body } = await s3.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: objectKey
        })
      );
      if (!Body) {
        throw new Error('missing body');
      }

      await pipeline(
        Body as Readable,
        parse({ columns: true }),
        validatorTransform(),
        stringify({ header: true }),
        createGzip()
        // async (source) => {
        //   await s3.send(
        //     new PutObjectCommand({
        //       Bucket: bucketName,
        //       Key: `/validations/${objectKey}`,
        //       Body: source
        //     })
        //   );
        // }
      );

      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: `/validations/${objectKey}`,
          Body: r.body
        })
      );
    } catch (e) {
      console.log('check out this error ->', e);
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
