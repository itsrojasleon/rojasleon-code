import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigatewayv2';
import * as integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { FunctionOptions, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as lambda from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3n from 'aws-cdk-lib/aws-s3-notifications';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = this.createHttpApi();
    const bucket = this.createBucket();
    const { queue } = this.createQueues(bucket);

    this.createPresignedUrlLambda(api, bucket);
    this.createValidateFilesLambda(queue, bucket);
  }

  private createQueues(bucket: s3.Bucket): {
    queue: sqs.Queue;
  } {
    const dlq = new sqs.Queue(this, 'dlq', {
      receiveMessageWaitTime: cdk.Duration.seconds(20),
      visibilityTimeout: cdk.Duration.minutes(16)
    });
    const queue = new sqs.Queue(this, 'queue', {
      visibilityTimeout: cdk.Duration.minutes(16),
      deadLetterQueue: {
        queue: dlq,
        maxReceiveCount: 3
      }
    });

    bucket.addObjectCreatedNotification(new s3n.SqsDestination(queue), {
      prefix: 'uploads/',
      suffix: '.csv'
    });

    return { queue };
  }

  private createBucket(): s3.Bucket {
    return new s3.Bucket(this, 'bucket');
  }

  private createHttpApi(): apigateway.HttpApi {
    return new apigateway.HttpApi(this, 'api');
  }

  private createPresignedUrlLambda(api: apigateway.HttpApi, bucket: s3.Bucket) {
    const createPresignedUrlLambda = this.createNodejsFunction({
      id: 'createPresignedUrlLambda',
      filename: 'create-presigned-url',
      environment: {
        BUCKET_NAME: bucket.bucketName
      },
      timeout: 6 // seconds.
    });
    api.addRoutes({
      path: '/batch/generate-presigned-url',
      methods: [apigateway.HttpMethod.POST],
      integration: new integrations.HttpLambdaIntegration(
        'LambdaIntegration',
        createPresignedUrlLambda
      )
    });

    bucket.grantPut(createPresignedUrlLambda);
  }

  private createValidateFilesLambda(queue: sqs.Queue, bucket: s3.Bucket) {
    const validateFilesLambda = this.createNodejsFunction({
      id: 'validateFilesLambda',
      filename: 'validate',
      timeout: 15 * 60 // 15 minutes.
    });
    validateFilesLambda.addEventSourceMapping('lambdaEventSource', {
      batchSize: 1,
      eventSourceArn: queue.queueArn,
      reportBatchItemFailures: true
    });

    bucket.grantRead(validateFilesLambda);
    bucket.grantWrite(validateFilesLambda);
    queue.grantConsumeMessages(validateFilesLambda);
  }

  private createNodejsFunction(attrs: {
    id: string;
    filename: string;
    environment?: FunctionOptions['environment'];
    timeout: number;
  }): lambda.NodejsFunction {
    return new lambda.NodejsFunction(this, attrs.id, {
      depsLockFilePath: 'bun.lockb',
      entry: `src/lambdas/${attrs.filename}.ts`,
      handler: 'handler',
      runtime: Runtime.NODEJS_20_X,
      bundling: {
        externalModules: ['@aws-sdk/*']
      },
      memorySize: 128,
      timeout: cdk.Duration.seconds(attrs.timeout),
      environment: attrs?.environment
    });
  }
}
