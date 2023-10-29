interface AccessToken {
  jwtToken: string
  payload: {
    exp: number
  }
}

interface IdentityToken {
  jwtToken: string
  payload: {
    exp: number
    "cognito:groups": string[]
    "cognito:username": string
  }
}

export interface CognitoTokens {
  accessToken: AccessToken
  idToken: IdentityToken
}

export interface UserData {
  demo_user: boolean
  email: string
  groups: string[]
  name: string
  username: string
}
