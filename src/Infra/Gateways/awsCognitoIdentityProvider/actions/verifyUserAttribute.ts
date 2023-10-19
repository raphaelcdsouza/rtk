import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IVerifyUserAttribute } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IVerifyUserAttribute.Input;

export class VerifyUserAttribute extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance });
  }

  protected async performAction({ accessToken, attribute, code }: ExecuteInput): Promise<void> {
    await this.serviceInstance.verifyUserAttribute({
      AccessToken: accessToken,
      AttributeName: attribute,
      Code: code,
    });
  }
}
