import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { RespondToAuthChallenge } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { IRespondToAuthChallenge } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('aws-sdk');

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<IRespondToAuthChallenge.Input, 'username'>;
type ExecuteOutput = IRespondToAuthChallenge.Output;

describe('login', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: RespondToAuthChallenge;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_user';
  const challengeNameInput = 'any_challenge_name';
  const mfaCode = 'any_mfa_code';
  const newPassword = 'any_new_password';
  const session = 'any_session';

  const tokenType = 'any_token_type';
  const accessToken = 'any_access_token';
  const refreshToken = 'any_refresh_token';
  const idToken = 'any_id_token';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.respondToAuthChallenge.mockImplementation(jest.fn().mockResolvedValue({
      AuthenticationResult: {
        AccessToken: accessToken,
        RefreshToken: refreshToken,
        IdToken: idToken,
        ExpiresIn: 3600,
        TokenType: tokenType,
      },
    }));
  });

  beforeEach(() => {
    sut = new RespondToAuthChallenge({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const respondToAuthObject = {
    ChallengeName: challengeNameInput,
    ClientId: clientId,
    ChallengeResponses: {
      USERNAME: username,
      SOFTWARE_TOKEN_MFA_CODE: mfaCode,
      SECRET_HASH: undefined as unknown as string,
    },
    Session: session,
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  describe('respond to MFA challenge', () => {
    it('should call "respondToAuthChallenge" with correct params', async () => {
      await sut.execute<ExecuteInput>({ name: challengeNameInput, responses: { mfaCode, newPassword: undefined }, session }, username);

      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledWith(respondToAuthObject);
      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledTimes(1);
    });

    it('should return authentication data', async () => {
      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ name: challengeNameInput, responses: { mfaCode, newPassword: undefined }, session }, username);

      expect(result).toEqual({
        authenticationData: {
          tokenType,
          accessToken,
          refreshToken,
          idToken,
        },
      });
    });
  });

  describe('respond to MFA challenge', () => {
    const respondToAuthObjectForNewPassword = {
      ChallengeName: challengeNameInput,
      ClientId: clientId,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: newPassword,
        SECRET_HASH: undefined as unknown as string,
      },
      Session: session,
    };

    it('should call "respondToAuthChallenge" with correct params', async () => {
      await sut.execute<ExecuteInput>({ name: challengeNameInput, responses: { mfaCode: undefined, newPassword }, session }, username);

      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledWith(respondToAuthObjectForNewPassword);
      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledTimes(1);
    });

    it('should return authentication data', async () => {
      const result = await sut.execute<ExecuteInput, ExecuteOutput>({ name: challengeNameInput, responses: { mfaCode: undefined, newPassword }, session }, username);

      expect(result).toEqual({
        authenticationData: {
          tokenType,
          accessToken,
          refreshToken,
          idToken,
        },
      });
    });
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new RespondToAuthChallenge({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "initiateAuth" with correct params', async () => {
      await sut.execute<ExecuteInput, ExecuteOutput>({ name: challengeNameInput, responses: { mfaCode }, session }, username);

      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledWith({
        ...respondToAuthObject,
        ChallengeResponses: {
          ...respondToAuthObject.ChallengeResponses,
          SECRET_HASH: 'any_secret_hash',
        },
      });
      expect(cognitoInterfaceMock.respondToAuthChallenge).toHaveBeenCalledTimes(1);
    });
  });
});
