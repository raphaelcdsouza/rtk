import { S3 } from '@aws-sdk/client-s3';

export type AwsS3TemplateConstructorParams = {
  s3Instance: S3;
  region?: string;
}
