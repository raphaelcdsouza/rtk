/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IGetUserAttributes } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IGetUserAttributes.Input
type ExecuteOutput = IGetUserAttributes.Output

export class GetUserAttributes extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance });
  }

  protected async performAction({ accessToken }: ExecuteInput): Promise<ExecuteOutput> {
    const { UserAttributes } = await this.serviceInstance.getUser({
      AccessToken: accessToken,
    });

    return UserAttributes!;
  }
}
