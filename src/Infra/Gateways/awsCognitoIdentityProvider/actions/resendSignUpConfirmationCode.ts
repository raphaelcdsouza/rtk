import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IResendSignUpConfirmationCode } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = undefined;
type ExecuteOutput = IResendSignUpConfirmationCode.Output;

export class ResendSignUpConfirmationCode extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance, clientSecret }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance, clientSecret });
  }

  protected async performAction(_: ExecuteInput, username: string, secretHash?: string): Promise<ExecuteOutput> {
    const { CodeDeliveryDetails } = await this.serviceInstance.resendConfirmationCode({
      ClientId: this.clientId,
      Username: username,
      SecretHash: secretHash,
    });

    return {
      destination: CodeDeliveryDetails?.Destination,
      deliveryMedium: CodeDeliveryDetails?.DeliveryMedium,
    };
  }
}
