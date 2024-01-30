#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import 'source-map-support/register';
import { AppStack } from '../lib/app-stack';

const app = new cdk.App();
new AppStack(app, 'AppStack', {
  stackName: 'scalable-s3-uploads'
});
