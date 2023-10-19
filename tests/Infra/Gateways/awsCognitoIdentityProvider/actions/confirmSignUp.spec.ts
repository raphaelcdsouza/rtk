import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { ConfirmSignUp } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IConfirmSignUp } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<IConfirmSignUp.Input, 'username'>;

describe('confirmSignup', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: ConfirmSignUp;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_user';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.confirmSignUp.mockImplementation(jest.fn().mockResolvedValue(undefined));
  });

  beforeEach(() => {
    sut = new ConfirmSignUp({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const confirmationCode = 'any_confirmation_code';

  const confirmSignUpObject = {
    ClientId: clientId,
    Username: username,
    ConfirmationCode: confirmationCode,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "confirmSignUp" with correct params', async () => {
    await sut.execute<ExecuteInput>({ code: confirmationCode }, username);

    expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledWith(confirmSignUpObject);
    expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledTimes(1);
  });

  it('should return nothing', async () => {
    const result = await sut.execute<ExecuteInput>({ code: confirmationCode }, username);

    expect(result).toBeUndefined();
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new ConfirmSignUp({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "confirmSignUp" with correct params - secret hash -', async () => {
      await sut.execute<ExecuteInput>({ code: confirmationCode }, username);

      expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledWith({
        ...confirmSignUpObject,
        SecretHash: 'any_secret_hash',
      });
      expect(cognitoInterfaceMock.confirmSignUp).toHaveBeenCalledTimes(1);
    });
  });
});
