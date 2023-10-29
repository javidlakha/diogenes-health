import { createContext } from "react"
import { CognitoUserSession } from "amazon-cognito-identity-js"

import { UserData } from "types"
import { LoginMethod } from "./User.hooks"

export interface UserContextType {
  confirm_registration: (
    username: string,
    confirmation_code: string,
  ) => Promise<unknown>
  create_account: (
    username: string,
    name: string,
    password: string,
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

export const UserContext = createContext<UserContextType | null>(null)
