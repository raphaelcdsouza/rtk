import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { SignUp } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { ISignUp } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<ISignUp.Input, 'username'>;
type ExecuteOutput = ISignUp.Output;

describe('signUp', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: SignUp;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_user';
  const password = 'any_password';

  const destination = 'any_destination';
  const sub = 'any_sub';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.signUp.mockImplementation(jest.fn().mockResolvedValue({
      UserConfirmed: false,
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: 'EMAIL',
        AttributeName: 'email',
      },
      UserSub: sub,
    }));
  });

  beforeEach(() => {
    sut = new SignUp({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const signUpObject = {
    ClientId: clientId,
    Username: username,
    Password: password,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "signUp" with correct params', async () => {
    await sut.execute<ExecuteInput>({ password }, username);

    expect(cognitoInterfaceMock.signUp).toHaveBeenCalledWith(signUpObject);
    expect(cognitoInterfaceMock.signUp).toHaveBeenCalledTimes(1);
  });

  it('should return cognito user id', async () => {
    const result = await sut.execute<ExecuteInput, ExecuteOutput>({ password }, username);

    expect(result.id).toEqual(sub);
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new SignUp({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "signUp" with correct params - secret hash -', async () => {
      await sut.execute<ExecuteInput>({ password }, username);

      expect(cognitoInterfaceMock.signUp).toHaveBeenCalledWith({
        ...signUpObject,
        SecretHash: 'any_secret_hash',
      });
      expect(cognitoInterfaceMock.signUp).toHaveBeenCalledTimes(1);
    });
  });

  describe('with user attributes', () => {
    it('should call "signUp" with correct params - user attributes -', async () => {
      const attributes = [
        {
          Name: 'any_name',
          Value: 'any_value',
        },
      ];

      await sut.execute<ExecuteInput>({ password, attributes }, username);

      expect(cognitoInterfaceMock.signUp).toHaveBeenCalledWith({
        ...signUpObject,
        UserAttributes: attributes,
      });
      expect(cognitoInterfaceMock.signUp).toHaveBeenCalledTimes(1);
    });

    it('should call "signUp" with correct params - user attributes length 0 -', async () => {
      await sut.execute<ExecuteInput>({ password, attributes: [] }, username);

      expect(cognitoInterfaceMock.signUp).toHaveBeenCalledWith(signUpObject);
      expect(cognitoInterfaceMock.signUp).toHaveBeenCalledTimes(1);
    });
  });
});
