/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { RespondToAuthChallengeCommandInput, ChallengeNameType } from '@aws-sdk/client-cognito-identity-provider';

import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IRespondToAuthChallenge } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<IRespondToAuthChallenge.Input, 'username'>;
type ExecuteOutput = IRespondToAuthChallenge.Output;

export class RespondToAuthChallenge extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ name, session, responses: { mfaCode, newPassword } }: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    const respondToAuthChallengeRequestObject: RespondToAuthChallengeCommandInput = {
      ChallengeName: name as (typeof ChallengeNameType)[keyof typeof ChallengeNameType],
      ClientId: this.clientId,
      Session: session,
      ChallengeResponses: {
        USERNAME: username,
        SECRET_HASH: secretHash!,
      },
    };

    if (mfaCode !== undefined) {
      respondToAuthChallengeRequestObject.ChallengeResponses!.SOFTWARE_TOKEN_MFA_CODE = mfaCode;
    }

    if (newPassword !== undefined) {
      respondToAuthChallengeRequestObject.ChallengeResponses!.NEW_PASSWORD = newPassword;
    }

    const result = await this.serviceInstance.respondToAuthChallenge(respondToAuthChallengeRequestObject);

    return {
      authenticationData: {
        tokenType: result.AuthenticationResult!.TokenType!,
        accessToken: result.AuthenticationResult!.AccessToken!,
        refreshToken: result.AuthenticationResult!.RefreshToken!,
        idToken: result.AuthenticationResult!.IdToken!,
      },
    };
  }
}
