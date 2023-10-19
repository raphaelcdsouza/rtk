import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

import { AwsCognitoIdentityProvider } from '../../../../src';
import * as Actions from '../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions';

jest.mock('@aws-sdk/client-cognito-identity-provider');
jest.mock('../../../../src/Infra/Gateways/awsCognitoIdentityProvider/actions');

describe('awsCognitoIdentityProvider', () => {
  let sut: AwsCognitoIdentityProvider;

  const region = 'any_region';
  const accessKeyId = 'any_access_key_id';
  const secretAccessKey = 'any_secret_access_key';
  const clientId = 'any_client_id';
  const clientSecret = 'any_client_secret';

  beforeEach(() => {
    sut = new AwsCognitoIdentityProvider({
      region, accessKeyId, secretAccessKey, clientId,
    });
  });

  it('should call "CognitoIdentityProvider" with correct params', () => {
    expect(sut).toBeDefined();
    expect(CognitoIdentityProvider).toHaveBeenCalledWith({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    expect(CognitoIdentityProvider).toHaveBeenCalledTimes(1);
  });

  it('should call "CognitoIdentityProvider" with correct params - without credentials object', () => {
    const alternativeSut = new AwsCognitoIdentityProvider({
      region, clientId,
    });

    expect(alternativeSut).toBeDefined();
    expect(CognitoIdentityProvider).toHaveBeenCalledWith({
      region,
    });
  });

  describe('signUp', () => {
    const username = 'any_username';
    const password = 'any_password';
    const attributes = [
      { Name: 'email', Value: 'any_email' },
      { Name: 'phone_number', Value: 'any_phone_number' },
    ];

    const signUpParamsObject = {
      password,
      attributes,
    };

    const returnedId = 'any_returned_id';
    const signUpReturnObject = {
      id: returnedId,
    };

    let signUpExecuteSpy: jest.Mock;

    beforeAll(() => {
      signUpExecuteSpy = jest.fn().mockResolvedValue(signUpReturnObject);
      jest.mocked(Actions.SignUp).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: signUpExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "SignUp" action with correct params - without "clientSecret"', async () => {
        await sut.signUp({ username, password, attributes });

        expect(Actions.SignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.SignUp).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "SignUp" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.signUp({ username, password, attributes });

        expect(Actions.SignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.SignUp).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.signUp({ username, password, attributes });

      expect(signUpExecuteSpy).toHaveBeenCalledWith(signUpParamsObject, username);
      expect(signUpExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return correct data', async () => {
      const result = await sut.signUp({ username, password, attributes });

      expect(result).toEqual(signUpReturnObject);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_signup_error');
      signUpExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.signUp({ username, password, attributes });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('confirmSignUp', () => {
    const username = 'any_username';
    const code = 'any_code';

    const confirmSignUpParamsObject = {
      code,
    };

    let confirmSignUpExecuteSpy: jest.Mock;

    beforeAll(() => {
      confirmSignUpExecuteSpy = jest.fn().mockResolvedValue(undefined);
      jest.mocked(Actions.ConfirmSignUp).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: confirmSignUpExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "ConfirmSignUp" action with correct params - without "clientSecret"', async () => {
        await sut.confirmSignUp({ username, code });

        expect(Actions.ConfirmSignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.ConfirmSignUp).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "ConfirmSignUp" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.confirmSignUp({ username, code });

        expect(Actions.ConfirmSignUp).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.ConfirmSignUp).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.confirmSignUp({ username, code });

      expect(confirmSignUpExecuteSpy).toHaveBeenCalledWith(confirmSignUpParamsObject, username);
      expect(confirmSignUpExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return undefined', async () => {
      const result = await sut.confirmSignUp({ username, code });

      expect(result).toBeUndefined();
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_confirmsignup_error');
      confirmSignUpExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.confirmSignUp({ username, code });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('resendSignUpConfirmationCode', () => {
    const username = 'any_username';

    const resendSignUpConfirmationCodeParamsObject = {};

    const deliveryMethod = 'any_delivery_method';
    const destination = 'any_destination';

    const resendSignUpConfirmationCodeReturnObject = {
      deliveryMethod,
      destination,
    };

    let resendSignUpConfirmationCodeExecuteSpy: jest.Mock;

    beforeAll(() => {
      resendSignUpConfirmationCodeExecuteSpy = jest.fn().mockResolvedValue(resendSignUpConfirmationCodeReturnObject);
      jest.mocked(Actions.ResendSignUpConfirmationCode).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: resendSignUpConfirmationCodeExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "ResendSignUpConfirmationCode" action with correct params - without "clientSecret"', async () => {
        await sut.resendSignUpConfirmationCode({ username });

        expect(Actions.ResendSignUpConfirmationCode).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider) });
        expect(Actions.ResendSignUpConfirmationCode).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "ResendSignUpConfirmationCode" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.resendSignUpConfirmationCode({ username });

        expect(Actions.ResendSignUpConfirmationCode).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.ResendSignUpConfirmationCode).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.resendSignUpConfirmationCode({ username });

      expect(resendSignUpConfirmationCodeExecuteSpy).toHaveBeenCalledWith(resendSignUpConfirmationCodeParamsObject, username);
      expect(resendSignUpConfirmationCodeExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return correct data', async () => {
      const response = await sut.resendSignUpConfirmationCode({ username });

      expect(response).toEqual(resendSignUpConfirmationCodeReturnObject);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_forgotPassword_error');
      resendSignUpConfirmationCodeExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.resendSignUpConfirmationCode({ username });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    const username = 'any_username';
    const password = 'any_password';

    const loginParamsObject = {
      password,
    };

    const tokenType = 'any_token_type';
    const accessToken = 'any_access_token';
    const refreshToken = 'any_refresh_token';
    const idToken = 'any_id_token';

    const loginReturnObjectWithAuthenticationData = {
      tokenType,
      accessToken,
      refreshToken,
      idToken,
    };

    const challengeName = 'any_challenge_name';
    const sub = 'any_sub';
    const session = 'any_session';

    const loginReturnObjectWithChallengeData = {
      challengeName,
      sub,
      session,
    };

    let loginExecuteSpy: jest.Mock;

    beforeAll(() => {
      loginExecuteSpy = jest.fn().mockResolvedValue(loginReturnObjectWithAuthenticationData);
      jest.mocked(Actions.Login).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: loginExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "Login" action with correct params - without "clientSecret"', async () => {
        await sut.login({ username, password });

        expect(Actions.Login).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.Login).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "Login" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.login({ username, password });

        expect(Actions.Login).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.Login).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.login({ username, password });

      expect(loginExecuteSpy).toHaveBeenCalledWith(loginParamsObject, username);
      expect(loginExecuteSpy).toHaveBeenCalledTimes(1);
    });

    describe('return data', () => {
      it('should return authentication data if "execute" returns "authenticationData"', async () => {
        const result = await sut.login({ username, password });

        expect(result).toEqual(loginReturnObjectWithAuthenticationData);
      });

      it('should return challenge data if "execute" returns "challengeData"', async () => {
        loginExecuteSpy.mockResolvedValueOnce(loginReturnObjectWithChallengeData);

        const result = await sut.login({ username, password });

        expect(result).toEqual(loginReturnObjectWithChallengeData);
      });
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_login_error');
      loginExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.login({ username, password });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('associateSoftwareToken', () => {
    const session = 'any_session';
    const accessToken = 'any_access_token';

    const associateSoftwareTokenParamsObject = {
      session,
      accessToken,
    };

    const publicKey = 'any_public_key';
    const returnedSession = 'any_returned_session';

    const associateSoftwareTokenReturnObject = {
      publicKey,
    };

    let associateSoftwareTokenExecuteSpy: jest.Mock;

    beforeAll(() => {
      associateSoftwareTokenExecuteSpy = jest.fn().mockResolvedValue(associateSoftwareTokenReturnObject);
      jest.mocked(Actions.AssociateSoftwareToken).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: associateSoftwareTokenExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "AssociateSoftwareToken" action with correct params - without "clientSecret"', async () => {
        await sut.associateSoftwareToken({ session, accessToken });

        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "AssociateSoftwareToken" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.associateSoftwareToken({ session, accessToken });

        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.AssociateSoftwareToken).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.associateSoftwareToken({ session, accessToken });

      expect(associateSoftwareTokenExecuteSpy).toHaveBeenCalledWith(associateSoftwareTokenParamsObject);
      expect(associateSoftwareTokenExecuteSpy).toHaveBeenCalledTimes(1);
    });

    describe('return data', () => {
      it('should return authentication data if "execute" returns "authenticationData"', async () => {
        const result = await sut.associateSoftwareToken({ session, accessToken });

        expect(result).toEqual(associateSoftwareTokenReturnObject);
      });

      it('should return challenge data if "execute" returns "challengeData"', async () => {
        associateSoftwareTokenExecuteSpy.mockResolvedValueOnce({ ...associateSoftwareTokenReturnObject, session: returnedSession });

        const result = await sut.associateSoftwareToken({ session, accessToken });

        expect(result).toEqual({ ...associateSoftwareTokenReturnObject, session: returnedSession });
      });
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_associateSoftwareToken_error');
      associateSoftwareTokenExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.associateSoftwareToken({ session, accessToken });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('verifySoftwareToken', () => {
    const session = 'any_session';
    const accessToken = 'any_access_token';
    const mfaCode = 'any_mfa_code';

    const verifySoftwareTokenParamsObject = {
      session,
      accessToken,
      mfaCode,
    };

    const status = 'any_status';
    const returnedSession = 'any_returned_session';

    const verifySoftwareTokenReturnObject = {
      status,
    };

    let verifySoftwareTokenExecuteSpy: jest.Mock;

    beforeAll(() => {
      verifySoftwareTokenExecuteSpy = jest.fn().mockResolvedValue(verifySoftwareTokenReturnObject);
      jest.mocked(Actions.VerifySoftwareToken).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: verifySoftwareTokenExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "VerifySoftwareToken" action with correct params - without "clientSecret"', async () => {
        await sut.verifySoftwareToken({ session, accessToken, mfaCode });

        expect(Actions.VerifySoftwareToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.VerifySoftwareToken).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "VerifySoftwareToken" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.verifySoftwareToken({ session, accessToken, mfaCode });

        expect(Actions.VerifySoftwareToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.VerifySoftwareToken).toHaveBeenCalledTimes(1);
      });
    });

    describe('input data', () => {
      it('should call "execute" method with correct params when "session" and "accessCode" provided', async () => {
        await sut.verifySoftwareToken({ session, accessToken, mfaCode });

        expect(verifySoftwareTokenExecuteSpy).toHaveBeenCalledWith(verifySoftwareTokenParamsObject);
        expect(verifySoftwareTokenExecuteSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "execute" method with correct params when "session" and "accessCode" not provided', async () => {
        await sut.verifySoftwareToken({ mfaCode });

        expect(verifySoftwareTokenExecuteSpy).toHaveBeenCalledWith({ mfaCode });
        expect(verifySoftwareTokenExecuteSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe('return data', () => {
      it('should return correct data without "session" property', async () => {
        const result = await sut.verifySoftwareToken({ session, accessToken, mfaCode });

        expect(result).toEqual(verifySoftwareTokenReturnObject);
      });

      it('should return correct data with "session" property', async () => {
        verifySoftwareTokenExecuteSpy.mockResolvedValueOnce({ ...verifySoftwareTokenReturnObject, session: returnedSession });

        const result = await sut.verifySoftwareToken({ session, accessToken, mfaCode });

        expect(result).toEqual({ ...verifySoftwareTokenReturnObject, session: returnedSession });
      });
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_verifySoftwareToken_error');
      verifySoftwareTokenExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.verifySoftwareToken({ session, accessToken, mfaCode });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('respondToAuthChallenge', () => {
    const name = 'any_name';
    const username = 'any_user_name';
    const session = 'any_session';
    const mfaCode = 'any_mfa_code';
    const newPassword = 'any_new_password';

    const responses = {
      mfaCode,
    };

    const respondToAuthChallengeParamsObject = {
      name,
      session,
      responses,
    };

    const tokenType = 'any_token_type';
    const accessToken = 'any_access_token';
    const refreshToken = 'any_refresh_token';
    const idToken = 'any_id_token';

    const respondToAuthChallengeReturnObject = {
      authenticationData: {
        tokenType,
        accessToken,
        refreshToken,
        idToken,
      },
    };

    let respondToAuthChallengeExecuteSpy: jest.Mock;

    beforeAll(() => {
      respondToAuthChallengeExecuteSpy = jest.fn().mockResolvedValue(respondToAuthChallengeReturnObject);
      jest.mocked(Actions.RespondToAuthChallenge).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: respondToAuthChallengeExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "RespondToAuthChallenge" action with correct params - without "clientSecret"', async () => {
        await sut.respondToAuthChallenge({
          name, session, username, responses,
        });

        expect(Actions.RespondToAuthChallenge).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.RespondToAuthChallenge).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "RespondToAuthChallenge" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.respondToAuthChallenge({
          name, session, username, responses,
        });

        expect(Actions.RespondToAuthChallenge).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.RespondToAuthChallenge).toHaveBeenCalledTimes(1);
      });
    });

    describe('input data', () => {
      it('should call "execute" method with correct params when "mfaCode" provided', async () => {
        await sut.respondToAuthChallenge({
          name, session, username, responses,
        });

        expect(respondToAuthChallengeExecuteSpy).toHaveBeenCalledWith(respondToAuthChallengeParamsObject, username);
        expect(respondToAuthChallengeExecuteSpy).toHaveBeenCalledTimes(1);
      });

      it('should call "execute" method with correct params when "newPassword" provided', async () => {
        await sut.respondToAuthChallenge({
          name, session, username, responses: { newPassword },
        });

        expect(respondToAuthChallengeExecuteSpy).toHaveBeenCalledWith({ name, session, responses: { newPassword } }, username);
        expect(respondToAuthChallengeExecuteSpy).toHaveBeenCalledTimes(1);
      });
    });

    it('should return correct data', async () => {
      const result = await sut.respondToAuthChallenge({
        name, session, username, responses,
      });

      expect(result).toEqual(respondToAuthChallengeReturnObject);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_respondToAuthChallenge_error');
      respondToAuthChallengeExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.respondToAuthChallenge({
        name, session, username, responses,
      });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('updateUserAttributes', () => {
    const accessToken = 'any_access_token';
    const attributes = [
      { Name: 'any_name_1', Value: 'any_value_1' },
      { Name: 'any_name_2', Value: 'any_value_2' },
    ];

    const updateUserAttributesParamsObject = {
      accessToken,
      attributes,
    };

    const deliveryMethod = 'any_delivery_method';
    const destination = 'any_destination';
    const attribute = 'any_attribute';

    const updateUserAttributesReturnObject = [
      {
        deliveryMethod,
        destination,
        attribute,
      },
    ];

    let updateUserAttributesExecuteSpy: jest.Mock;

    beforeAll(() => {
      updateUserAttributesExecuteSpy = jest.fn().mockResolvedValue(updateUserAttributesReturnObject);
      jest.mocked(Actions.UpdateUserAttributes).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: updateUserAttributesExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "UpdateUserAttributes" action with correct params - without "clientSecret"', async () => {
        await sut.updateUserAttributes({ accessToken, attributes });

        expect(Actions.UpdateUserAttributes).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.UpdateUserAttributes).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "UpdateUserAttributes" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.updateUserAttributes({ accessToken, attributes });

        expect(Actions.UpdateUserAttributes).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.UpdateUserAttributes).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.updateUserAttributes({ accessToken, attributes });

      expect(updateUserAttributesExecuteSpy).toHaveBeenCalledWith(updateUserAttributesParamsObject);
      expect(updateUserAttributesExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return correct data', async () => {
      const result = await sut.updateUserAttributes({ accessToken, attributes });

      expect(result).toEqual(updateUserAttributesReturnObject);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_updateUserAttributes_error');
      updateUserAttributesExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.updateUserAttributes({ accessToken, attributes });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('verifyUserAttribute', () => {
    const accessToken = 'any_access_token';
    const attribute = 'any_attribute';
    const code = 'any_code';

    const verifyUserAttributeParamsObject = {
      accessToken,
      attribute,
      code,
    };

    let verifyUserAttributesExecuteSpy: jest.Mock;

    beforeAll(() => {
      verifyUserAttributesExecuteSpy = jest.fn().mockResolvedValue(undefined);
      jest.mocked(Actions.VerifyUserAttribute).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: verifyUserAttributesExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "VerifyUserAttribute" action with correct params - without "clientSecret"', async () => {
        await sut.verifyUserAttribute({ accessToken, attribute, code });

        expect(Actions.VerifyUserAttribute).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.VerifyUserAttribute).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "VerifyUserAttribute" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.verifyUserAttribute({ accessToken, attribute, code });

        expect(Actions.VerifyUserAttribute).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.VerifyUserAttribute).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.verifyUserAttribute({ accessToken, attribute, code });

      expect(verifyUserAttributesExecuteSpy).toHaveBeenCalledWith(verifyUserAttributeParamsObject);
      expect(verifyUserAttributesExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_verifyUserAttribute_error');
      verifyUserAttributesExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.verifyUserAttribute({ accessToken, attribute, code });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('changePassword', () => {
    const accessToken = 'any_access_token';
    const oldPassword = 'any_old_password';
    const newPassword = 'any_new_password';

    const changePasswordParamsObject = {
      accessToken,
      oldPassword,
      newPassword,
    };

    let changePasswordExecuteSpy: jest.Mock;

    beforeAll(() => {
      changePasswordExecuteSpy = jest.fn().mockResolvedValue(undefined);
      jest.mocked(Actions.ChangePassword).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: changePasswordExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "ChangePassword" action with correct params', async () => {
        await sut.changePassword({ accessToken, oldPassword, newPassword });

        expect(Actions.ChangePassword).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider) });
        expect(Actions.ChangePassword).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.changePassword({ accessToken, oldPassword, newPassword });

      expect(changePasswordExecuteSpy).toHaveBeenCalledWith(changePasswordParamsObject);
      expect(changePasswordExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_changePassword_error');
      changePasswordExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.changePassword({ accessToken, oldPassword, newPassword });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('forgotPassword', () => {
    const username = 'any_access_token';

    const forgotPasswordParamsObject = {};

    const deliveryMethod = 'any_delivery_method';
    const destination = 'any_destination';
    const attribute = 'any_attribute';

    const forgotPasswordReturnObject = {
      deliveryMethod,
      destination,
      attribute,
    };

    let forgotPasswordExecuteSpy: jest.Mock;

    beforeAll(() => {
      forgotPasswordExecuteSpy = jest.fn().mockResolvedValue(forgotPasswordReturnObject);
      jest.mocked(Actions.ForgotPassword).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: forgotPasswordExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "ForgotPassword" action with correct params - without "clientSecret"', async () => {
        await sut.forgotPassword({ username });

        expect(Actions.ForgotPassword).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider) });
        expect(Actions.ForgotPassword).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "ForgotPassword" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.forgotPassword({ username });

        expect(Actions.ForgotPassword).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.ForgotPassword).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.forgotPassword({ username });

      expect(forgotPasswordExecuteSpy).toHaveBeenCalledWith(forgotPasswordParamsObject, username);
      expect(forgotPasswordExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return correct data', async () => {
      const response = await sut.forgotPassword({ username });

      expect(response).toEqual(forgotPasswordReturnObject);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_forgotPassword_error');
      forgotPasswordExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.forgotPassword({ username });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('confirmForgotPassword', () => {
    const username = 'any_username';
    const newPassword = 'any_new_password';
    const code = 'any_code';

    const confirmForgotPasswordParamsObject = {
      newPassword,
      code,
    };

    let confirmForgotPasswordExecuteSpy: jest.Mock;

    beforeAll(() => {
      confirmForgotPasswordExecuteSpy = jest.fn().mockResolvedValue(undefined);
      jest.mocked(Actions.ConfirmForgotPassword).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: confirmForgotPasswordExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "ConfirmForgotPassword" action with correct params - without "clientSecret"', async () => {
        await sut.confirmForgotPassword({ username, newPassword, code });

        expect(Actions.ConfirmForgotPassword).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider) });
        expect(Actions.ConfirmForgotPassword).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "ForgotPassword" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.confirmForgotPassword({ username, newPassword, code });

        expect(Actions.ConfirmForgotPassword).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.ConfirmForgotPassword).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.confirmForgotPassword({ username, newPassword, code });

      expect(confirmForgotPasswordExecuteSpy).toHaveBeenCalledWith(confirmForgotPasswordParamsObject, username);
      expect(confirmForgotPasswordExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_confirmForgotPassword_error');
      confirmForgotPasswordExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.confirmForgotPassword({ username, newPassword, code });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('toggleMFA', () => {
    const accessToken = 'any_access_token';
    const enabled = true;
    const preferred = false;

    const toggleMFAParamsObject = {
      accessToken,
      enabled,
      preferred,
    };

    let toggleMFAExecuteSpy: jest.Mock;

    beforeAll(() => {
      toggleMFAExecuteSpy = jest.fn().mockResolvedValue(undefined);
      jest.mocked(Actions.ToggleMFA).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: toggleMFAExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "ToggleMFA" action with correct params', async () => {
        await sut.toggleMFA({ accessToken, enabled, preferred });

        expect(Actions.ToggleMFA).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider) });
        expect(Actions.ToggleMFA).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.toggleMFA({ accessToken, enabled, preferred });

      expect(toggleMFAExecuteSpy).toHaveBeenCalledWith(toggleMFAParamsObject);
      expect(toggleMFAExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_toggleMFA_error');
      toggleMFAExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.toggleMFA({ accessToken, enabled, preferred });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('deleteUser', () => {
    const accessToken = 'any_access_token';

    const deleteUserParamsObject = {
      accessToken,
    };

    let deleteUserExecuteSpy: jest.Mock;

    beforeAll(() => {
      deleteUserExecuteSpy = jest.fn().mockResolvedValue(undefined);
      jest.mocked(Actions.DeleteUser).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: deleteUserExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "DeleteUser" action with correct params', async () => {
        await sut.deleteUser({ accessToken });

        expect(Actions.DeleteUser).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider) });
        expect(Actions.DeleteUser).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.deleteUser({ accessToken });

      expect(deleteUserExecuteSpy).toHaveBeenCalledWith(deleteUserParamsObject);
      expect(deleteUserExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_deleteUser_error');
      deleteUserExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.deleteUser({ accessToken });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('getUserAttributes', () => {
    const accessToken = 'any_access_token';

    const getUserAttributesParamsObject = {
      accessToken,
    };
    const getUserReturnObject = [
      {
        Name: 'any_attribute',
        Value: 'any_value',
      },
    ];

    let getUserAttributesExecuteSpy: jest.Mock;

    beforeAll(() => {
      getUserAttributesExecuteSpy = jest.fn().mockResolvedValue(getUserReturnObject);
      jest.mocked(Actions.GetUserAttributes).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: getUserAttributesExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "GetUserAttributes" action with correct params', async () => {
        await sut.getUserAttributes({ accessToken });

        expect(Actions.GetUserAttributes).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider) });
        expect(Actions.GetUserAttributes).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.getUserAttributes({ accessToken });

      expect(getUserAttributesExecuteSpy).toHaveBeenCalledWith(getUserAttributesParamsObject);
      expect(getUserAttributesExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return correct data', async () => {
      const response = await sut.getUserAttributes({ accessToken });

      expect(response).toEqual(getUserReturnObject);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_getUserAttributes_error');
      getUserAttributesExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.getUserAttributes({ accessToken });

      await expect(promise).rejects.toThrow(error);
    });
  });

  describe('refreshToken', () => {
    const refreshTokenInput = 'any_refresh_token_input';
    const sub = 'any_sub';

    const refreshTokenParamsObject = {
      refreshToken: refreshTokenInput,
    };

    const tokenType = 'any_token_type';
    const accessToken = 'any_access_token';
    const idToken = 'any_id_token';

    const refreshTokenReturnObjectWithAuthenticationData = {
      tokenType,
      accessToken,
      idToken,
    };

    let refreshTokenExecuteSpy: jest.Mock;

    beforeAll(() => {
      refreshTokenExecuteSpy = jest.fn().mockResolvedValue(refreshTokenReturnObjectWithAuthenticationData);
      jest.mocked(Actions.RefreshToken).mockImplementation(jest.fn().mockImplementation(() => ({
        execute: refreshTokenExecuteSpy,
      })));
    });

    describe('constructor', () => {
      it('should instantiate "RefreshToken" action with correct params - without "clientSecret"', async () => {
        await sut.refreshToken({ refreshToken: refreshTokenInput, sub });

        expect(Actions.RefreshToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret: undefined });
        expect(Actions.RefreshToken).toHaveBeenCalledTimes(1);
      });

      it('should instantiate "RefreshToken" action with correct params - with "clientSecret"', async () => {
        const optionalSut = new AwsCognitoIdentityProvider({
          region, accessKeyId, secretAccessKey, clientId, clientSecret,
        });

        await optionalSut.refreshToken({ refreshToken: refreshTokenInput, sub });

        expect(Actions.RefreshToken).toHaveBeenCalledWith({ clientId, cognitoInstance: expect.any(CognitoIdentityProvider), clientSecret });
        expect(Actions.RefreshToken).toHaveBeenCalledTimes(1);
      });
    });

    it('should call "execute" method with correct params', async () => {
      await sut.refreshToken({ refreshToken: refreshTokenInput, sub });

      expect(refreshTokenExecuteSpy).toHaveBeenCalledWith(refreshTokenParamsObject, sub);
      expect(refreshTokenExecuteSpy).toHaveBeenCalledTimes(1);
    });

    it('should return authentication data if "execute" returns "authenticationData"', async () => {
      const result = await sut.refreshToken({ refreshToken: refreshTokenInput, sub });

      expect(result).toEqual(refreshTokenReturnObjectWithAuthenticationData);
    });

    it('should rethrow error if "execute" throws', async () => {
      const error = new Error('any_login_error');
      refreshTokenExecuteSpy.mockRejectedValueOnce(error);

      const promise = sut.refreshToken({ refreshToken: refreshTokenInput, sub });

      await expect(promise).rejects.toThrow(error);
    });
  });
});
