import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { mock, MockProxy } from 'jest-mock-extended';

import { Login } from '../../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';
import { AwsCognitoTemplate } from '../../../../../src/Infra/Gateways/Templates/AWS';
import { ILogin } from '../../../../../src/Infra/Interfaces/Gateways';

jest.mock('../../../../../src/Utils/hash', () => ({
  awsCognitoSecretHash: jest.fn().mockReturnValue('any_secret_hash'),
}));

type ExecuteInput = Omit<ILogin.Input, 'username'>;
type ExecuteOutput = ILogin.Output;

describe('login', () => {
  let cognitoInterfaceMock: MockProxy<CognitoIdentityProvider>;
  let sut: Login;

  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  const username = 'any_user';
  const password = 'any_password';

  const tokenType = 'any_token_type';
  const accessToken = 'any_access_token';
  const refreshToken = 'any_refresh_token';
  const idToken = 'any_id_token';
  const challengeName = 'any_challenge_name';
  const session = 'any_session';
  const sub = 'any_sub';

  beforeAll(() => {
    cognitoInterfaceMock = mock();
    cognitoInterfaceMock.initiateAuth.mockImplementation(jest.fn().mockResolvedValue({
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
    sut = new Login({ cognitoInstance: cognitoInterfaceMock, clientId });
  });

  const loginObject = {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password,
      SECRET_HASH: undefined as unknown as string,
    },
  };

  it('should be instance of AwsCognitoTemplate', () => {
    expect(sut).toBeInstanceOf(AwsCognitoTemplate);
  });

  it('should call "initiateAuth" with correct params', async () => {
    await sut.execute<ExecuteInput>({ password }, username);

    expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledWith(loginObject);
    expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledTimes(1);
  });

  it('should return correct data in case of login without MFA', async () => {
    const result = await sut.execute<ExecuteInput, ExecuteOutput>({ password }, username);

    expect(result).toEqual({
      authenticationData: {
        tokenType,
        accessToken,
        refreshToken,
        idToken,
      },
    });
  });

  it('should return correct data in case of login with MFA', async () => {
    cognitoInterfaceMock.initiateAuth.mockImplementationOnce(jest.fn().mockResolvedValue({
      ChallengeName: challengeName,
      Session: session,
      ChallengeParameters: {
        USER_ID_FOR_SRP: sub,
      },
    }));

    const result = await sut.execute<ExecuteInput, ExecuteOutput>({ password }, username);

    expect(result).toEqual({
      challengeData: {
        challengeName,
        session,
        sub,
      },
    });
  });

  describe('with secret hash', () => {
    beforeEach(() => {
      sut = new Login({ cognitoInstance: cognitoInterfaceMock, clientId, clientSecret });
    });

    it('should call "initiateAuth" with correct params', async () => {
      await sut.execute<ExecuteInput>({ password }, username);

      expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledWith({
        ...loginObject,
        AuthParameters: {
          ...loginObject.AuthParameters,
          SECRET_HASH: 'any_secret_hash',
        },
      });
      expect(cognitoInterfaceMock.initiateAuth).toHaveBeenCalledTimes(1);
    });
  });
});
