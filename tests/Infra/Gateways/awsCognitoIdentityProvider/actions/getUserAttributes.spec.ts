import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { GetUserAttributes } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IGetUserAttributes } from '../../../../../src';

type ExecuteInput = IGetUserAttributes.Input

describe('getUser', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: GetUserAttributes;

  const clientId = 'any_client_id';
  const accessToken = 'any_access_token';

  const getUserReturnObject = {
    UserAttributes: [
      {
        Name: 'any_attribute',
        Value: 'any_value',
      },
    ],
  };

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.getUser.mockImplementation(jest.fn().mockResolvedValue(getUserReturnObject));
  });

  beforeEach(() => {
    sut = new GetUserAttributes({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const getUserAttributsObject = {
    AccessToken: accessToken,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "getUser" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken });

    expect(cognitoInterfaceMock.getUser).toHaveBeenCalledWith(getUserAttributsObject);
    expect(cognitoInterfaceMock.getUser).toHaveBeenCalledTimes(1);
  });

  it('should return correct data', async () => {
    const result = await sut.execute<ExecuteInput>({ accessToken });

    expect(result).toEqual(getUserReturnObject.UserAttributes);
  });
});
