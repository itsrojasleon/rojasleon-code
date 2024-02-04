import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { handler } from '../create-presigned-url';

const callHandler = async () => {
  // @ts-ignore
  const res: APIGatewayProxyStructuredResultV2 = await handler();

  return {
    ...res,
    body: JSON.parse(res.body || '{}')
  };
};

describe.skip('create-presigned-url lambda handler', () => {
  it('validates env variables', async () => {
    await callHandler().catch((e) => {
      assert.strictEqual(e.message, 'missing BUCKET_NAME environment variable');
    });
  });

  it('creates s3 presigned POST URLs', async () => {
    process.env.BUCKET_NAME = 'bucket';

    const { statusCode, body } = await callHandler();

    assert.strictEqual(statusCode, 201);
    assert.strictEqual(body.message, 'presigned POST URL generated');
    assert.strictEqual(typeof body.data.url, 'string');
    assert.strictEqual(typeof body.data.fields, 'object');
  });
});
