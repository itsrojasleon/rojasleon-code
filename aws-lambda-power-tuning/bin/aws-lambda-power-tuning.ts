#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AwsLambdaPowerTuningStack } from '../lib/aws-lambda-power-tuning-stack';

const app = new cdk.App();
new AwsLambdaPowerTuningStack(app, 'AwsLambdaPowerTuningStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  }
});
