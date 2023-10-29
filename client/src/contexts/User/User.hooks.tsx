import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from "amazon-cognito-identity-js"

import { COGNITO_USER_POOL, DEMO_USER_POOL } from "constants/cognito"
import { UserData } from "types"

export const UserPool = new CognitoUserPool(COGNITO_USER_POOL)
export const DemoUserPool = new CognitoUserPool(DEMO_USER_POOL)

export enum LoginMethod {
  DEMO = "DEMO",
  USER = "USER",
}

interface useCognitoReturn {
  create_account: (
    username: string,
    name: string,
    password: string,
  ) => Promise<unknown>
  confirm_registration: (
    username: string,
    confirmation_code: string,
  ) => Promise<unknown>
  get_tokens: () => Promise<CognitoUserSession>
  get_user_settings: () => Promise<UserData>
  login: (
    username: string,
    password: string,
    method?: LoginMethod,
  ) => Promise<unknown>
  logout: () => void
}

export function useCognito(): useCognitoReturn {
  async function confirm_registration(
    username: string,
    confirmation_code: string,
  ) {
    DemoUserPool.getCurrentUser()?.signOut()

    return await new Promise((resolve, reject) => {
      const user = new CognitoUser({ Username: username, Pool: UserPool })

      if (user) {
        user.confirmRegistration(
          confirmation_code,
          true,
          async (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          },
        )
      } else {
        reject()
      }
    })
  }

  async function create_account(
    username: string,
    name: string,
    password: string,
  ) {
    DemoUserPool.getCurrentUser()?.signOut()

    return await new Promise((resolve, reject) => {
      UserPool.signUp(
        username,
        password,
        [
          new CognitoUserAttribute({ Name: "email", Value: username }),
          new CognitoUserAttribute({ Name: "name", Value: name }),
        ],
        [],
        (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        },
      )
    })
  }

  async function get_tokens(): Promise<CognitoUserSession> {
    return await new Promise((resolve, reject) => {
      const user = UserPool.getCurrentUser() || DemoUserPool.getCurrentUser()
      if (!user) {
        reject("No user")
        return
      }

      user.getSession(
        (error: Error | null, session: CognitoUserSession | null) => {
          if (error) {
            reject(error)
          }

          if (session) {
            resolve(session)
          }
        },
      )
    })
  }

  async function get_user_settings(): Promise<UserData> {
    return new Promise((resolve, reject) => {
      get_tokens()
        .then((session) => {
          const identity_token = session.getIdToken().decodePayload()
          const user_pool = identity_token["iss"].match(/com\/(.+)$/)[1]
          if (user_pool === COGNITO_USER_POOL.UserPoolId) {
            resolve({
              demo_user: false,
              email: identity_token["email"] || "",
              groups: identity_token["cognito:groups"] || [],
              name: identity_token["name"] || "",
              username: identity_token["cognito:username"] || "",
            })
          } else {
            resolve({
              demo_user: true,
              email: "guest-user@diogeneshealth.com",
              groups: [],
              name: "Guest User",
              username: "guest-user",
            })
          }
        })
        .catch(() => reject())
    })
  }

  async function login(
    username: string,
    password: string,
    method: LoginMethod = LoginMethod.USER,
  ) {
    DemoUserPool.getCurrentUser()?.signOut()

    return await new Promise((resolve, reject) => {
      const pool = method === LoginMethod.USER ? UserPool : DemoUserPool
      const user = new CognitoUser({ Username: username, Pool: pool })

      const authentication_details = new AuthenticationDetails({
        Username: username,
        Password: password,
      })

      user.authenticateUser(authentication_details, {
        onSuccess: (session) => {
          resolve(session)
        },
        onFailure: (error) => {
          reject(error)
        },
        newPasswordRequired: (data) => {
          console.error("New password required")
          reject(data)
        },
      })
    })
  }

  function logout() {
    UserPool.getCurrentUser()?.signOut()
    DemoUserPool.getCurrentUser()?.signOut()
  }

  return {
    confirm_registration,
    create_account,
    get_tokens,
    get_user_settings,
    login,
    logout,
  }
}
