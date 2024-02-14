import { APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import * as assert from 'node:assert';
import { describe, it } from 'node:test';
import { handler } from '../calculate-prime-numbers';

const callHandler = async (limit?: number) => {
  // @ts-ignore
  const res: APIGatewayProxyStructuredResultV2 = await handler({
    queryStringParameters: {
      limit
    }
  });

  return {
    statusCode: res.statusCode,
    body: JSON.parse(res.body || '{}')
  };
};

describe('calculate-prime-numbers handler', () => {
  it('should return 168 primes under 1000', async () => {
    const { body } = await callHandler(1000);
    assert.equal(body.len, 168);
  });

  it('should return 50 prime number under 250', async () => {
    const { body } = await callHandler(100);
    assert.equal(body.len, 25);
  });

  it('calculates default limit of 100', async () => {
    const { body } = await callHandler();
    assert.equal(body.len, 25);
  });
});
