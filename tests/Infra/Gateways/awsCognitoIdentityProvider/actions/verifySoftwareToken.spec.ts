import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { VerifySoftwareToken } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IVerifySoftwareToken } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');

type ExecuteInput = IVerifySoftwareToken.Input;
type ExecuteOutput = IVerifySoftwareToken.Output;

describe('verifySoftwareToken', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: VerifySoftwareToken;

  const clientId = 'any_client_id';

  const inputSession = 'any_input_session';
  const accessToken = 'any_access_token';
  const mfaCode = 'any_mfa_code';

  const status = 'any_status';
  const outputSession = 'any_output_session';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.verifySoftwareToken.mockImplementation(jest.fn().mockResolvedValue({
      Status: status,
      Session: outputSession,
    }));
  });

  beforeEach(() => {
    sut = new VerifySoftwareToken({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const verifySoftwareTokenObject = {
    Session: inputSession,
    AccessToken: undefined,
    UserCode: mfaCode,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  describe('using session property after first login', () => {
    it('should call "verifySoftwareToken" with correct params', async () => {
      await sut.execute<ExecuteInput>({ session: inputSession, mfaCode });

      expect(cognitoInterfaceMock.verifySoftwareToken).toHaveBeenCalledWith(verifySoftwareTokenObject);
      expect(cognitoInterfaceMock.verifySoftwareToken).toHaveBeenCalledTimes(1);
    });

    it('should return session and status', async () => {
      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ session: inputSession, mfaCode });

      expect(result).toEqual({
        status,
        session: outputSession,
      });
    });
  });

  describe('using access token property when logged in', () => {
    const verifySoftwareTokenWithAccessTokenObject = {
      Session: undefined,
      AccessToken: accessToken,
      UserCode: mfaCode,
    };

    it('should call "verifySoftwareToken" with correct params', async () => {
      await sut.execute<ExecuteInput>({ accessToken, mfaCode });

      expect(cognitoInterfaceMock.verifySoftwareToken).toHaveBeenCalledWith(verifySoftwareTokenWithAccessTokenObject);
      expect(cognitoInterfaceMock.verifySoftwareToken).toHaveBeenCalledTimes(1);
    });

    it('should return status', async () => {
      cognitoInterfaceMock.verifySoftwareToken.mockImplementationOnce(jest.fn().mockResolvedValue({
        Status: status,
      }));

      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ accessToken, mfaCode });

      expect(result).toEqual({
        status,
      });
    });
  });
});
