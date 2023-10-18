import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { DeleteUser } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IDeleteUser } from '../../../../../src';

jest.mock('aws-sdk');

type ExecuteInput = IDeleteUser.Input

describe('associateSoftwareToken', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: DeleteUser;

  const clientId = 'any_client_id';

  const accessToken = 'any_access_token';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.deleteUser.mockImplementation(jest.fn().mockResolvedValue({}));
  });

  beforeEach(() => {
    sut = new DeleteUser({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const deleteUserObject = {
    AccessToken: accessToken,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "deleteUser" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken });

    expect(cognitoInterfaceMock.deleteUser).toHaveBeenCalledWith(deleteUserObject);
    expect(cognitoInterfaceMock.deleteUser).toHaveBeenCalledTimes(1);
  });

  it('should return undefined', async () => {
    const result = await sut.execute<ExecuteInput>({ accessToken });

    expect(result).toBeUndefined();
  });
});
