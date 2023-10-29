export const COGNITO_ERRORS = {
  CodeMismatchException: "CodeMismatchException",
  IncorrectCredentials: {
    name: "NotAuthorizedException",
    message: "Incorrect username or password.",
  },
  InvalidParameterException: "InvalidParameterException",
  InvalidPasswordException: "InvalidPasswordException",
  UserAlreadyConfirmed: {
    name: "NotAuthorizedException",
    message: "User cannot be confirmed. Current status is CONFIRMED",
  },
  UserNotFoundException: {
    name: "UserNotFoundException",
    message: "User does not exist.",
  },
  UsernameExistsException: "UsernameExistsException",
}

export const COGNITO_USER_GROUPS = {
  ExperimentalAI: "ExperimentalAI",
  TemplateEditors: "TemplateEditors",
}

export const COGNITO_USER_POOL = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID!,
  ClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID!,
}

export const DEMO_REGISTRATION_URL = process.env.REACT_APP_DEMO_REGISTRATION_URL

export const DEMO_USER_POOL = {
  UserPoolId: process.env.REACT_APP_DEMO_USER_POOL_ID!,
  ClientId: process.env.REACT_APP_DEMO_USER_POOL_CLIENT_ID!,
}
