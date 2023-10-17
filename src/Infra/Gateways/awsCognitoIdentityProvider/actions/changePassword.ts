import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IChangePassword } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IChangePassword.Input;

export class ChangePassword extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance });
  }

  protected async performAction({ accessToken, newPassword, oldPassword }: ExecuteInput): Promise<void> {
    await this.serviceInstance.changePassword({
      AccessToken: accessToken,
      PreviousPassword: oldPassword,
      ProposedPassword: newPassword,
    });
  }
}
