/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IForgotPassword } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = undefined;
type ExecuteOutput = IForgotPassword.Output;

export class ForgotPassword extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction(_: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    const { CodeDeliveryDetails } = await this.serviceInstance.forgotPassword({
      ClientId: this.clientId,
      Username: username,
      SecretHash: secretHash!,
    });

    return {
      destination: CodeDeliveryDetails!.Destination!,
      deliveryMethod: CodeDeliveryDetails!.DeliveryMedium!,
      attribute: CodeDeliveryDetails!.AttributeName!,
    };
  }
}
