/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IVerifySoftwareToken } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IVerifySoftwareToken.Input;
type ExecuteOutput = IVerifySoftwareToken.Output;

export class VerifySoftwareToken extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance });
  }

  protected async performAction({ session, accessToken, mfaCode }: ExecuteInput): Promise<ExecuteOutput> {
    const { Status, Session } = await this.serviceInstance.verifySoftwareToken({
      Session: session,
      AccessToken: accessToken,
      UserCode: mfaCode,
    });

    return {
      status: Status!,
      session: Session,
    };
  }
}
