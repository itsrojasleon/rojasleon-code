import { GetObjectCommand } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@smithy/util-stream';
import { SQSBatchResponse } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { createReadStream } from 'fs';
import { describe, it } from 'node:test';
import { s3 } from '../../clients';
import { handler } from '../validate';

const stream = sdkStreamMixin(createReadStream(__dirname + '/data/test.csv'));
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
};

describe('validate lambda handler', () => {
  it('haa', async () => {
    s3Mock.on(GetObjectCommand).resolves({
      Body: stream
    });

    await callHandler();
  });
});
