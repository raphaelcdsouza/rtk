import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { ConfirmForgotPassword } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IConfirmForgotPassword } from '../../../../../src';

jest.mock('aws-sdk');

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<IConfirmForgotPassword.Input, 'username'>;

describe('associateSoftwareToken', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: ConfirmForgotPassword;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_username';
  const newPassword = 'any_new_password';
  const code = 'any_code';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.confirmForgotPassword.mockImplementation(jest.fn().mockResolvedValue({}));
  });

  beforeEach(() => {
    sut = new ConfirmForgotPassword({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const confirmForgotPasswordObject = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: code,
    Password: newPassword,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "confirmForgotPassword" with correct params', async () => {
    await sut.execute<ExecuteInput>({ newPassword, code }, username);

    expect(cognitoInterfaceMock.confirmForgotPassword).toHaveBeenCalledWith(confirmForgotPasswordObject);
    expect(cognitoInterfaceMock.confirmForgotPassword).toHaveBeenCalledTimes(1);
  });

  it('should return correct data', async () => {
    const result = await sut.execute<ExecuteInput>({ newPassword, code }, username);

    expect(result).toBeUndefined();
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new ConfirmForgotPassword({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "confirmForgotPassword" with correct params', async () => {
      await sut.execute<ExecuteInput>({ newPassword, code }, username);

      expect(cognitoInterfaceMock.confirmForgotPassword).toHaveBeenCalledWith({
        ...confirmForgotPasswordObject,
        SecretHash: 'any_secret_hash',
      });
      expect(cognitoInterfaceMock.confirmForgotPassword).toHaveBeenCalledTimes(1);
    });
  });
});
