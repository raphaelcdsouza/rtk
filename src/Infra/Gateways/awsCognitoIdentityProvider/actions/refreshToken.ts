/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IRefreshToken } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<IRefreshToken.Input, 'sub'>;
type ExecuteOutput = IRefreshToken.Output;

export class RefreshToken extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ refreshToken }: ExecuteInput, _: string, secretHash?: string): Promise<ExecuteOutput> {
    const result = await this.serviceInstance.initiateAuth({
      ClientId: this.clientId,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        SECRET_HASH: secretHash!,
      },
    });

    return {
      tokenType: result.AuthenticationResult!.TokenType!,
      accessToken: result.AuthenticationResult!.AccessToken!,
      idToken: result.AuthenticationResult!.IdToken!,
    };
  }
}
