import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { s3 } from '../clients';
import { generateId } from '../utils';

export const handler: APIGatewayProxyHandlerV2 = async () => {
  if (!process.env.BUCKET_NAME) {
    throw new Error('missing BUCKET_NAME environment variable');
  }

  const { url, fields } = await createPresignedPost(s3, {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploads/${generateId()}.csv`,
    Expires: 3600 // 1 hour.
    // Conditions,
    // Fields
  });

  return {
    statusCode: 201,
    body: JSON.stringify({
      message: 'presigned POST URL generated',
      data: {
        url,
        fields
      }
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  };
};
