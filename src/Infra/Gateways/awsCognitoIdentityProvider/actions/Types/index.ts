import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';

export type AwsCognitoTemplateConstructorParams = {
  cognitoInstance: CognitoIdentityProvider;
  clientId: string;
  clientSecret?: string;
}
