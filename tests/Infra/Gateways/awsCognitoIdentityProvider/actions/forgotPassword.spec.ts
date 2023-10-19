import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { ForgotPassword } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IForgotPassword } from '../../../../../src';

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = undefined;
type ExecuteOutput = IForgotPassword.Output;

describe('associateSoftwareToken', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: ForgotPassword;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_username';

  const destination = 'any_destination';
  const deliveryMethod = 'any_delivery_method';
  const attribute = 'any_attribute';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.forgotPassword.mockImplementation(jest.fn().mockResolvedValue({
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: deliveryMethod,
        AttributeName: attribute,
      },
    }));
  });

  beforeEach(() => {
    sut = new ForgotPassword({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const forgotPasswordObject = {
    ClientId: clientId,
    Username: username,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "forgotPassword" with correct params', async () => {
    await sut.execute<ExecuteInput>(undefined, username);

    expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledWith(forgotPasswordObject);
    expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledTimes(1);
  });

  it('should return correct data', async () => {
    const result = await sut.execute<ExecuteInput, ExecuteOutput>(undefined, username);

    expect(result).toEqual({
      destination,
      deliveryMethod,
      attribute,
    });
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new ForgotPassword({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "forgotPassword" with correct params', async () => {
      await sut.execute<ExecuteInput>(undefined, username);

      expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledWith({
        ...forgotPasswordObject,
        SecretHash: 'any_secret_hash',
      });
      expect(cognitoInterfaceMock.forgotPassword).toHaveBeenCalledTimes(1);
    });
  });
});
