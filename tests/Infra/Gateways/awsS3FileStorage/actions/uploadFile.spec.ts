import { S3 } from '@aws-sdk/client-s3';
import { mock, MockProxy } from 'jest-mock-extended';

import { UploadFile } from '../../../../../src/Infra/Gateways/awsS3FileStorage/actions';
import { IUploadFile } from '../../../../../src/Infra/Interfaces/Gateways';
import { UploadFileInputMotherObject, UploadFileOutputMotherObject, PutObjectMotherObject } from './models/uploadFile';
import { UploadFileModel } from './models/uploadFile/model';

type ExecuteInput = IUploadFile.Input;

describe('UploadFile', () => {
  let s3Instance: MockProxy<S3>;
  let sut: UploadFile;

  beforeAll(() => {
    s3Instance = mock();
  });

  beforeEach(() => {
    sut = new UploadFile({ s3Instance });
  });

  it('should call "putObject" with correct params', async () => {
    await sut.execute<ExecuteInput>(UploadFileInputMotherObject.valid());

    expect(s3Instance.putObject).toHaveBeenCalledTimes(1);
    expect(s3Instance.putObject).toHaveBeenCalledWith(PutObjectMotherObject.valid());

    jest.clearAllMocks();

    await sut.execute<ExecuteInput>(UploadFileInputMotherObject.withMIMEType());

    expect(s3Instance.putObject).toHaveBeenCalledTimes(1);
    expect(s3Instance.putObject).toHaveBeenCalledWith(PutObjectMotherObject.withContentType());

    jest.clearAllMocks();

    await sut.execute<ExecuteInput>(UploadFileInputMotherObject.withBuffer());

    expect(s3Instance.putObject).toHaveBeenCalledTimes(1);
    expect(s3Instance.putObject).toHaveBeenCalledWith(PutObjectMotherObject.withBuffer());

    jest.clearAllMocks();

    await sut.execute<ExecuteInput>(UploadFileInputMotherObject.withStream());

    expect(s3Instance.putObject).toHaveBeenCalledTimes(1);
    expect(s3Instance.putObject).toHaveBeenCalledWith(PutObjectMotherObject.withStream());
  });

  it('should return the S3 url', async () => {
    const result = await sut.execute<ExecuteInput>(UploadFileInputMotherObject.valid());

    expect(result).toEqual(UploadFileOutputMotherObject.valid());

    const withoutRegionSut = new UploadFile({ s3Instance, region: new UploadFileModel().region });

    const withouRegionResult = await withoutRegionSut.execute<ExecuteInput>(UploadFileInputMotherObject.valid());

    expect(withouRegionResult).toEqual(UploadFileOutputMotherObject.withRegion());
  });
});
