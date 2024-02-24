import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambdaNode from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';

export class AwsLambdaPowerTuningStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const func = new lambdaNode.NodejsFunction(this, 'func', {
      entry: 'src/lambdas/calculate-prime-numbers.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout: cdk.Duration.minutes(5),
      bundling: {
        minify: true
      },
      memorySize: 128
    });

    // NOTE: When using aws-lambda-power-tuning you DON'T need a lambda URL, just
    // the ARN. I'm adding the url here just for testing purposes.
    const { url } = func.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      invokeMode: lambda.InvokeMode.BUFFERED,
      cors: {
        allowedMethods: [lambda.HttpMethod.GET]
      }
    });

    new cdk.CfnOutput(this, 'functionUrl', {
      value: url
    });
    // This must be used as the input for the aws-lambda-power-tuning.
    new cdk.CfnOutput(this, 'functionArn', {
      value: func.functionArn
    });
  }
}
