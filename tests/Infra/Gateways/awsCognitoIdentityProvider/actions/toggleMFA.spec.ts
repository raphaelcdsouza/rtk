import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { mock, MockProxy } from 'jest-mock-extended';

import { ToggleMFA } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IToggleMFA } from '../../../../../src';

jest.mock('aws-sdk');

type ExecuteInput = IToggleMFA.Input;

describe('associateSoftwareToken', () => {
  let setUserMFAPreferencePromiseSpy: jest.Mock;
  let cognitoInterfaceMock: MockProxy<CognitoIdentityServiceProvider>;
  let sut: ToggleMFA;

  const clientId = 'any_client_id';

  const accessToken = 'any_access_token';
  const enabled = true;
  const preferred = true;

  beforeAll(() => {
    setUserMFAPreferencePromiseSpy = jest.fn().mockResolvedValue({});
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.setUserMFAPreference.mockImplementation(jest.fn().mockImplementation(() => ({
      promise: setUserMFAPreferencePromiseSpy,
    })));
  });

  beforeEach(() => {
    sut = new ToggleMFA({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const setUserMFAObject = {
    AccessToken: accessToken,
    SoftwareTokenMfaSettings: {
      Enabled: enabled,
      PreferredMfa: preferred,
    },
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "setUserMFAPreference" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken, enabled, preferred });

    expect(cognitoInterfaceMock.setUserMFAPreference).toHaveBeenCalledWith(setUserMFAObject);
    expect(cognitoInterfaceMock.setUserMFAPreference).toHaveBeenCalledTimes(1);
  });

  it('should call "setUserMFAPreference" with correct params - when "enabled === false", "PreferredMFA" property should be always false', async () => {
    await sut.execute<ExecuteInput>({ accessToken, enabled: false, preferred });

    expect(cognitoInterfaceMock.setUserMFAPreference).toHaveBeenCalledWith({ ...setUserMFAObject, SoftwareTokenMfaSettings: { Enabled: false, PreferredMfa: false } });
    expect(cognitoInterfaceMock.setUserMFAPreference).toHaveBeenCalledTimes(1);
  });

  it('should call "promise" with correct params', async () => {
    await sut.execute<ExecuteInput>({ accessToken, enabled, preferred });

    expect(setUserMFAPreferencePromiseSpy).toHaveBeenCalledWith();
    expect(setUserMFAPreferencePromiseSpy).toHaveBeenCalledTimes(1);
  });

  it('should return undefined', async () => {
    const result = await sut.execute<ExecuteInput>({ accessToken, enabled, preferred });

    expect(result).toBeUndefined();
  });
});
