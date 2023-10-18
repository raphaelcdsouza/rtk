/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AwsCognitoTemplate } from '../../Templates/AWS';
import { IUpdateUserAttributes } from '../../../Interfaces/Gateways';
import { AwsCognitoTemplateConstructorParams } from './Types';

type ExecuteInput = IUpdateUserAttributes.Input;
type ExecuteOutput = IUpdateUserAttributes.Output;

export class UpdateUserAttributes extends AwsCognitoTemplate {
  constructor({ clientId, cognitoInstance }: AwsCognitoTemplateConstructorParams) {
    super({ clientId, cognitoInstance });
  }

  protected async performAction({ accessToken, attributes }: ExecuteInput): Promise<void | ExecuteOutput> {
    const { CodeDeliveryDetailsList } = await this.serviceInstance.updateUserAttributes({
      AccessToken: accessToken,
      UserAttributes: attributes,
    });

    if (CodeDeliveryDetailsList !== undefined && CodeDeliveryDetailsList.length > 0) {
      return CodeDeliveryDetailsList.map(({ Destination, DeliveryMedium, AttributeName }) => ({
        destination: Destination!,
        deliveryMethod: DeliveryMedium!,
        attribute: AttributeName!,
      }));
    }
  }
}
