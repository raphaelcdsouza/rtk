/* eslint-disable max-classes-per-file */
import { S3 } from '@aws-sdk/client-s3';

import { AwsS3Template } from '../../../../src/Infra/Gateways/Templates/AWS';
import { FileStorageError } from '../../../../src/Errors';
import { awsErrorMapper } from '../../../../src/Utils/Gateways/Error';

jest.mock('../../../../src/Errors/FileStorageError', () => ({
  FileStorageError: jest.fn(),
}));
jest.mock('../../../../src/Utils/Gateways/Error/mapper', () => ({
  awsErrorMapper: jest.fn().mockReturnValue('any_mapped_error'),
}));

const s3InterfaceMock: jest.Mocked<S3> = new S3() as any;

class AwsS3Stub extends AwsS3Template {
  result = 'any_result';

  constructor() {
    super({
      s3Instance: s3InterfaceMock,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async performAction(params: any): Promise<any> {
    return this.result;
  }
}

describe('AwsS3Template', () => {
  let sut: AwsS3Stub;

  const paramsObject = {
    any: 'any_param',
  };

  beforeEach(() => {
    sut = new AwsS3Stub();
  });

  it('should throw a "FileStorageError" if "getObject" throws passing correct params to error constructor', async () => {
    const errorMessage = 'any_error_message';
    const errorCode = 'any_error_code';
    const errorObject = {
      message: errorMessage,
      code: errorCode,
    };
    jest.spyOn(sut, 'performAction').mockRejectedValueOnce(errorObject);

    const promise = sut.execute(paramsObject);

    await expect(promise).rejects.toBeInstanceOf(FileStorageError);
    expect(FileStorageError).toHaveBeenCalledTimes(1);
    expect(FileStorageError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
    expect(awsErrorMapper).toHaveBeenCalledTimes(1);
    expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 's3');
  });

  it('should call "performAction" method with correct params', async () => {
    const performActionSpy = jest.spyOn(sut, 'performAction');

    await sut.execute(paramsObject);

    expect(performActionSpy).toHaveBeenCalledWith(paramsObject);
  });

  it('should return same result as "performAction" method', async () => {
    const result = await sut.execute(paramsObject);

    expect(result).toBe(sut.result);
  });
});
