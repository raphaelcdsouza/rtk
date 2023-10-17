/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IConfirmForgotPassword } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<IConfirmForgotPassword.Input, 'username'>;

export class ConfirmForgotPassword extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ code, newPassword }: ExecuteInput, username: string, secretHash?: string): Promise<void> {
    await this.serviceInstance.confirmForgotPassword({
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
      Password: newPassword,
      SecretHash: secretHash!,
    });
  }
}
