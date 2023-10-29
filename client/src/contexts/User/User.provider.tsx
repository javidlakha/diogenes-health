import React from "react"

import { UserContext } from "./User.context"
import { useCognito } from "./User.hooks"

interface UserProviderProps {
  children: React.ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const {
    confirm_registration,
    create_account,
    get_tokens,
    get_user_settings,
    login,
    logout,
  } = useCognito()

  return (
    <UserContext.Provider
      value={{
        confirm_registration,
        create_account,
        get_tokens,
        get_user_settings,
        login,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
