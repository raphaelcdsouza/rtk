/* eslint-disable max-classes-per-file */
import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { AwsCognitoTemplate } from '../../../../src/Infra/Gateways/Templates/AWS';
import { IdentityProviderError } from '../../../../src/Errors';
import { awsCognitoSecretHash } from '../../../../src/Utils';
import { awsErrorMapper } from '../../../../src/Utils/Gateways/Error';

jest.mock('../../../../src/Errors', () => ({
  IdentityProviderError: jest.fn(),
}));
jest.mock('../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_client_secret-hashed'),
}));
jest.mock('../../../../src/Utils/Gateways/Error/mapper', () => ({
  awsErrorMapper: jest.fn().mockReturnValue('any_error_mapped'),
}));

const cognitoInterfaceMock: jest.Mocked<CognitoIdentityProvider> = new CognitoIdentityProvider() as any;

const clientIdMock = 'any_client_id';
const clientSecretMock = 'any_client_secret';

class AwsCognitoStub extends AwsCognitoTemplate {
  result = 'any_resultany_param';

  constructor(clientId: string, clientSecret?: string) {
    super({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async performAction(params: any, username?: string, secretHash?: string): Promise<any> {
    return this.result;
  }
}

describe('AwsServiceTemplate', () => {
  let sut: AwsCognitoStub;

  const paramsObject = {
    any: 'any_param',
  };
  const username = 'any_username';

  beforeEach(() => {
    sut = new AwsCognitoStub(clientIdMock);
  });

  it('should throw an instance of "IdentityProviderError" if "performAction" throws', async () => {
    const errorMessage = 'any_error_message';
    const errorCode = 'any_error_code';
    const errorObject = {
      message: errorMessage,
      code: errorCode,
    };

    jest.spyOn(sut, 'performAction').mockRejectedValueOnce(errorObject);

    const promise = sut.execute(paramsObject);

    await expect(promise).rejects.toBeInstanceOf(IdentityProviderError);
    expect(IdentityProviderError).toHaveBeenCalledTimes(1);
    expect(IdentityProviderError).toHaveBeenCalledWith(errorMessage, expect.any(String), 'aws', errorCode);
    expect(awsErrorMapper).toHaveBeenCalledTimes(1);
    expect(awsErrorMapper).toHaveBeenCalledWith(errorCode, 'cognito');
  });

  it('should call "performAction" method with correct params', async () => {
    const performActionSpy = jest.spyOn(sut, 'performAction');

    await sut.execute(paramsObject);

    expect(performActionSpy).toHaveBeenCalledWith(paramsObject, undefined, undefined);
  });

  it('should return same result as "performAction" method', async () => {
    const result = await sut.execute(paramsObject);

    expect(result).toBe(sut.result);
  });

  it('should call "performAction" method with correct params when "username" is provided', async () => {
    const performActionSpy = jest.spyOn(sut, 'performAction');

    await sut.execute(paramsObject, username);

    expect(performActionSpy).toHaveBeenCalledWith(paramsObject, username, undefined);
  });

  it('should not call "awsCognitoSecretHash" if "clientSecret" is undefined', async () => {
    await sut.execute(paramsObject, username);

    expect(awsCognitoSecretHash).toHaveBeenCalledTimes(0);
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new AwsCognitoStub(clientIdMock, clientSecretMock);
    });

    it('should call "performAction" method with correct params', async () => {
      const performActionSpy = jest.spyOn(sut, 'performAction');

      await sut.execute(paramsObject, username);

      expect(performActionSpy).toHaveBeenCalledWith(paramsObject, username, 'any_client_secret-hashed');
    });

    it('should not call "awsCognitoSecretHash" if "username" is undefined', async () => {
      await sut.execute(paramsObject);

      expect(awsCognitoSecretHash).toHaveBeenCalledTimes(0);
    });

    it('should call "awsCognitoSecretHash" with correct params', async () => {
      await sut.execute(paramsObject, username);

      expect(awsCognitoSecretHash).toHaveBeenCalledWith(username, clientIdMock, clientSecretMock);
      expect(awsCognitoSecretHash).toHaveBeenCalledTimes(1);
    });
  });
});
