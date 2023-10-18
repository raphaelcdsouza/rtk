import { SignUpCommandInput } from '@aws-sdk/client-cognito-identity-provider';

import { AwsCognitoTemplate } from '../../Templates/AWS';
import { ISignUp } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = Omit<ISignUp.Input, 'username'>;
type ExecuteOutput = ISignUp.Output;

export class SignUp extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction({ password, attributes }: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    const signUpRequestObject: SignUpCommandInput = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      SecretHash: secretHash,
    };

    if (attributes !== undefined && attributes.length > 0) {
      signUpRequestObject.UserAttributes = attributes;
    }

    const { UserSub } = await this.serviceInstance.signUp(signUpRequestObject);

    return {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      id: UserSub!,
    };
  }
}
