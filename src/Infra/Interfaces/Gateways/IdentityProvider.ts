type AttributesType = {
  Name: string | undefined,
  Value?: string,
}

type DeliveryDetailsType = {
  deliveryMethod: string
  destination: string
  attribute: string
}

export interface ISignUp {
  signUp: (params: ISignUp.Input) => Promise<ISignUp.Output>
}

export namespace ISignUp {
  export type Input = {
    username: string
    password: string
    attributes?: AttributesType[]
  }

  export type Output = {
    id: string
  }
}

export interface IConfirmSignUp {
  confirmSignUp: (params: IConfirmSignUp.Input) => Promise<void>
}

export namespace IConfirmSignUp {
  export type Input = {
    username: string
    code: string
  }
}

export interface IResendSignUpConfirmationCode {
  resendSignUpConfirmationCode: (params: IResendSignUpConfirmationCode.Input) => Promise<IResendSignUpConfirmationCode.Output>
}

export namespace IResendSignUpConfirmationCode {
  export type Input = {
    username: string
  }

  export type Output = {
    destination?: string
    deliveryMedium?: string
  }
}

export interface ILogin {
  login: (params: ILogin.Input) => Promise<ILogin.Output>
}

export namespace ILogin {
  export type Input = {
    username: string
    password: string
  }

  export type Output = {
    authenticationData?: {
      tokenType?: string
      accessToken?: string
      refreshToken?: string
      idToken?: string
    },
    challengeData?: {
      challengeName?: string
      sub?: string
      session?: string
    }
  }
}

export interface IAssociateSoftwareToken {
  associateSoftwareToken: (params: IAssociateSoftwareToken.Input) => Promise<IAssociateSoftwareToken.Output>
}

export namespace IAssociateSoftwareToken {
  export type Input = {
    session?: string
    accessToken?: string
  }

  export type Output = {
    publicKey: string
    session?: string
  }
}

export interface IVerifySoftwareToken {
  verifySoftwareToken: (params: IVerifySoftwareToken.Input) => Promise<IVerifySoftwareToken.Output>
}

export namespace IVerifySoftwareToken {
  export type Input = {
    session?: string
    accessToken?: string
    mfaCode: string
  }

  export type Output = {
    status: string
    session?: string
  }
}

export interface IRespondToAuthChallenge {
  respondToAuthChallenge: (params: IRespondToAuthChallenge.Input) => Promise<IRespondToAuthChallenge.Output>
}

export namespace IRespondToAuthChallenge {
  export type Input = {
    name: string
    username: string
    session: string
    responses: {
      mfaCode?: string
      newPassword?: string
    }
  }

  export type Output = {
    authenticationData: {
      tokenType?: string
      accessToken?: string
      refreshToken?: string
      idToken?: string
    }
  }
}

export interface IToggleMFA {
  toggleMFA: (params: IToggleMFA.Input) => Promise<void>
}

export namespace IToggleMFA {
  export type Input = {
    accessToken: string
    enabled: boolean
    preferred: boolean
  }
}

export interface IUpdateUserAttributes {
  updateUserAttributes: (params: IUpdateUserAttributes.Input) => Promise<void | IUpdateUserAttributes.Output>
}

export namespace IUpdateUserAttributes {
  export type Input = {
    accessToken: string
    attributes: AttributesType[]
  }
  export type Output = DeliveryDetailsType[]
}

export interface IVerifyUserAttribute {
  verifyUserAttribute: (params: IVerifyUserAttribute.Input) => Promise<void>
}

export namespace IVerifyUserAttribute {
  export type Input = {
    accessToken: string
    attribute: string
    code: string
  }
}

export interface IChangePassword {
  changePassword: (params: IChangePassword.Input) => Promise<void>
}

export namespace IChangePassword {
  export type Input = {
    accessToken: string
    newPassword: string
    oldPassword: string
  }
}

export interface IForgotPassword {
  forgotPassword: (params: IForgotPassword.Input) => Promise<IForgotPassword.Output>
}

export namespace IForgotPassword {
  export type Input = {
    username: string
  }
  export type Output = DeliveryDetailsType
}

export interface IConfirmForgotPassword {
  confirmForgotPassword: (params: IConfirmForgotPassword.Input) => Promise<void>
}

export namespace IConfirmForgotPassword {
  export type Input = {
    username: string
    newPassword: string
    code: string
  }
}

export interface IDeleteUser {
  deleteUser: (params: IDeleteUser.Input) => Promise<void>
}

export namespace IDeleteUser {
  export type Input = {
    accessToken: string
  }
}

export interface IGetUserAttributes {
  getUserAttributes: (params: IGetUserAttributes.Input) => Promise<IGetUserAttributes.Output>
}

export namespace IGetUserAttributes {
  export type Input = {
    accessToken: string
  }
  export type Output = AttributesType[]
}

export interface IRefreshToken {
  refreshToken: (params: IRefreshToken.Input) => Promise<IRefreshToken.Output>
}

export namespace IRefreshToken {
  export type Input = {
    sub: string
    refreshToken: string
  }

  export type Output = {
    tokenType?: string
    accessToken?: string
    idToken?: string
  }
}
