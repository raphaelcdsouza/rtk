// import { S3 } from 'aws-sdk';
import { S3, S3ClientConfig, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { FileStorageError } from '../../../Errors';
import { awsErrorMapper } from '../../../Utils/Gateways/Error';

import { IRetrieveFile, IUploadFile } from '../../Interfaces/Gateways';

type AwsS3FileStorageConstructorParams = {
  region?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}

export class AwsS3FileStorage implements IRetrieveFile, IUploadFile {
  private readonly region?: string;

  private readonly s3Instance: S3;

  constructor({ region, accessKeyId, secretAccessKey }: AwsS3FileStorageConstructorParams) {
    let credentials: S3ClientConfig['credentials'];

    if (accessKeyId !== undefined && secretAccessKey !== undefined) {
      credentials = {
        accessKeyId,
        secretAccessKey,
      };
    }

    this.region = region;

    this.s3Instance = new S3({
      credentials,
      region,
    });
  }

  async retrieveFileFromStream({ key, bucketName }: IRetrieveFile.Input): Promise<ReadableStream | undefined> {
    try {
      const stream = (await this.retrieveFromAws(key, bucketName)).Body;
      return stream === undefined ? undefined : stream.transformToWebStream();
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async retrieveFile({ key, bucketName, type = 'buffer' }: IRetrieveFile.Input): Promise<IRetrieveFile.Input['type'] extends 'buffer' ? Buffer : ReadableStream> {
    try {
      const byteArray = (await this.retrieveFromAws(key, bucketName)).Body;
      return byteArray === undefined ? undefined : Buffer.from(await byteArray.transformToByteArray()) as any;
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  async uploadFile({
    bucketName, file, key, mimeType,
  }: IUploadFile.Input): Promise<string> {
    try {
      const S3Params: PutObjectCommandInput = {
        Bucket: bucketName,
        Key: key,
        Body: file,
      };

      if (mimeType !== undefined) {
        S3Params.ContentType = mimeType;
      }

      await this.s3Instance.putObject(S3Params);

      return `https://${bucketName}.s3.${this.getRegion()}.amazonaws.com/${key}`;
    } catch (err: any) {
      throw this.throwError(err);
    }
  }

  private retrieveFromAws(key: string, bucketName: string) {
    return this.s3Instance.getObject({
      Bucket: bucketName,
      Key: key,
    });
  }

  private getRegion() {
    return this.region ?? 'us-west-2';
  }

  private throwError(err: any) {
    return new FileStorageError(err.message, awsErrorMapper(err.code, 's3'), 'aws', err.code);
  }
}
