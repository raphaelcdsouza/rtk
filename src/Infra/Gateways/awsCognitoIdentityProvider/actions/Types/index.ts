import { CognitoIdentityProvider as CognitoIdentityServiceProvider } from '@aws-sdk/client-cognito-identity-provider';

export type AwsCognitoTemplateConstructorParams = {
  cognitoInstance: CognitoIdentityServiceProvider;
  clientId: string;
  clientSecret?: string;
}
