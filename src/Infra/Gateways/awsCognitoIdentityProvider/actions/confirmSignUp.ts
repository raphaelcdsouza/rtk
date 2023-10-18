import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IConfirmSignUp } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<IConfirmSignUp.Input, 'username'>;

export class ConfirmSignUp extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ code }: ExecuteInput, username: string, secretHash?: string): Promise<void> {
    await this.serviceInstance.confirmSignUp({
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: code,
      SecretHash: secretHash,
    });
  }
}
