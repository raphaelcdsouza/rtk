import { PutObjectCommandInput } from '@aws-sdk/client-s3';

import { IUploadFile } from '../../../Interfaces/Gateways';
import { AwsS3Template } from '../../Templates/AWS';
import { AwsS3TemplateConstructorParams } from './types';

type ExecuteInput = IUploadFile.Input;

export class UploadFile extends AwsS3Template {
  region?: string;

  constructor({ s3Instance, region }: AwsS3TemplateConstructorParams) {
    super({ s3Instance });

    this.region = region;
  }

  protected async performAction({
    bucketName, file, key, mimeType,
  }: ExecuteInput): Promise<string> {
    const params: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: file,
    };

    if (mimeType !== undefined) {
      params.ContentType = mimeType;
    }

    await this.serviceInstance.putObject(params);

    return `https://${bucketName}.s3.${this.getRegion()}.amazonaws.com/${key}`;
  }

  private getRegion() {
    return this.region !== undefined ? this.region : 'us-west-2';
  }
}
