import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { VerifyUserAttribute } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IVerifyUserAttribute } from '../../../../../src';

type ExecuteInput = IVerifyUserAttribute.Input;

describe('associateSoftwareToken', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: VerifyUserAttribute;

  const clientId = 'any_client_id';

  const accessToken = 'any_access_token';
  const attribute = 'any_attribute';
  const code = 'any_code';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.verifyUserAttribute.mockImplementation(jest.fn().mockResolvedValue({}));
  });

  beforeEach(() => {
    sut = new VerifyUserAttribute({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const verifyUserAttributeObject = {
    AccessToken: accessToken,
    AttributeName: attribute,
    Code: code,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "verifyUserAttribute" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken, attribute, code });

    expect(cognitoInterfaceMock.verifyUserAttribute).toHaveBeenCalledWith(verifyUserAttributeObject);
    expect(cognitoInterfaceMock.verifyUserAttribute).toHaveBeenCalledTimes(1);
  });

  it('should return undefined', async () => {
    const result = await sut.execute<ExecuteInput>({ accessToken, attribute, code });

    expect(result).toBeUndefined();
  });
});
