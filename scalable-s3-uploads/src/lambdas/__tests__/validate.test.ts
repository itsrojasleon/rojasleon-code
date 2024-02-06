import { GetObjectCommand } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@smithy/util-stream';
import { SQSBatchResponse } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { createReadStream } from 'fs';
import { describe, it } from 'node:test';
import { s3 } from '../../clients';
import { handler } from '../validate';

const stream = sdkStreamMixin(
  createReadStream(__dirname + '/data/largefile.csv')
);
const s3Mock = mockClient(s3);

const callHandler = async () => {
  // @ts-ignore
  const res: SQSBatchResponse = await handler({
    Records: [
      {
        body: JSON.stringify({
          Records: [
            { s3: { bucket: { name: 'bucket' }, object: { key: 'key' } } }
          ]
        })
      }
    ]
  });
  return res;
};

describe('validate lambda handler', () => {
  it('haha dude', async () => {
    s3Mock.on(GetObjectCommand).resolves({
      Body: stream
    });

    const r = await callHandler();

    console.log(r);
  });
});
