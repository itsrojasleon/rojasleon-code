import { APIGatewayProxyHandlerV2 } from 'aws-lambda';

const isPrime = (number: number) => {
  for (let i = 2; i <= Math.sqrt(number); i++) {
    if (number % i === 0) return false;
  }
  return number > 1;
};

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const primes = [];
  const limit = event.queryStringParameters?.limit;
  const max = limit ? parseInt(limit) : 100;

  for (let n = 2; n <= max; n++) {
    if (isPrime(n)) primes.push(n);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ len: primes.length })
  };
};
