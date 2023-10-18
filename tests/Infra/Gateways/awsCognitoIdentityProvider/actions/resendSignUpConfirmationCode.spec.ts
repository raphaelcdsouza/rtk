import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { ResendSignUpConfirmationCode } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IResendSignUpConfirmationCode } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = undefined;
type ExecuteOutput = IResendSignUpConfirmationCode.Output;

describe('resendSignUpConfirmationCode', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: ResendSignUpConfirmationCode;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const destination = 'any_destination';
  const deliveryMedium = 'any_delivery_medium';
  const username = 'any_user';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.resendConfirmationCode.mockImplementation(jest.fn().mockResolvedValue({
      CodeDeliveryDetails: {
        Destination: destination,
        DeliveryMedium: deliveryMedium,
        AttributeName: 'email',
      },
    }));
  });

  beforeEach(() => {
    sut = new ResendSignUpConfirmationCode({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const resendConfirmationCodeObject = {
    ClientId: clientId,
    Username: username,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "resendConfirmationCode" with correct params', async () => {
    await sut.execute<ExecuteInput>(undefined, username);

    expect(cognitoInterfaceMock.resendConfirmationCode).toHaveBeenCalledWith(resendConfirmationCodeObject);
    expect(cognitoInterfaceMock.resendConfirmationCode).toHaveBeenCalledTimes(1);
  });

  it('should return destination and delivery medium', async () => {
    const result = await sut.execute<ExecuteInput, ExecuteOutput>(undefined, username);

    expect(result).toEqual({
      destination,
      deliveryMedium,
    });
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new ResendSignUpConfirmationCode({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "resendConfirmationCode" with correct params - secret hash -', async () => {
      await sut.execute<ExecuteInput>(undefined, username);

      expect(cognitoInterfaceMock.resendConfirmationCode).toHaveBeenCalledWith({
        ...resendConfirmationCodeObject,
        SecretHash: 'any_secret_hash',
      });
      expect(cognitoInterfaceMock.resendConfirmationCode).toHaveBeenCalledTimes(1);
    });
  });
});
