/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IAssociateSoftwareToken } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IAssociateSoftwareToken.Input;
type ExecuteOutput = IAssociateSoftwareToken.Output;

export class AssociateSoftwareToken extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance });
  }

  protected async performAction({ session, accessToken }: ExecuteInput): Promise<ExecuteOutput> {
    const { SecretCode, Session } = await this.serviceInstance.associateSoftwareToken({
      Session: session,
      AccessToken: accessToken,
    });

    return {
      publicKey: SecretCode!,
      session: Session,
    };
  }
}
