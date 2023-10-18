import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IToggleMFA } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IToggleMFA.Input;

export class ToggleMFA extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance });
  }

  protected async performAction({ accessToken, enabled, preferred }: ExecuteInput): Promise<void> {
    await this.serviceInstance.setUserMFAPreference({
      AccessToken: accessToken,
      SoftwareTokenMfaSettings: {
        Enabled: enabled,
        PreferredMfa: enabled ? preferred : false,
      },
    });
  }
}
