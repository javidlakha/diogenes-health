import { useContext, useEffect, useState } from "react"

import { UserContext, UserContextType } from "contexts/User/User.context"
import { NavigationCompact } from "./Compact"
import { NavigationFull } from "./Full"
import "./navigation.css"

export enum Mode {
  LOGGED_OUT = "LOGGED_OUT",
  USER = "USER",
  DEMO = "DEMO",
}

export function Navigation() {
  const [mode, set_mode] = useState<Mode>(Mode.LOGGED_OUT)
  const { get_user_settings } = useContext(UserContext) as UserContextType
  useEffect(() => {
    get_user_settings()
      .then((settings) => {
        if (settings.demo_user) {
          set_mode(Mode.DEMO)
        } else {
          set_mode(Mode.USER)
        }
      })
      .catch(() => set_mode(Mode.LOGGED_OUT))
  }, [get_user_settings])

  return (
    <>
      <NavigationCompact mode={mode} />
      <NavigationFull mode={mode} />
    </>
  )
}
