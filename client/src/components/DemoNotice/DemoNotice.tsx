import { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"

import { UserContext, UserContextType } from "contexts/User/User.context"
import "./demo-notice.css"

export enum Mode {
  LOGGED_OUT = "LOGGED_OUT",
  USER = "USER",
  DEMO = "DEMO",
}

export function DemoNotice() {
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

  if (mode !== Mode.DEMO) {
    return null
  }

  return (
    <div className="demo-container">
      <div className="demo-notice">
        Diogenes Health is better with an account - you can save your forms and
        templates and access them from any device.{" "}
        <Link to="/register">Registration</Link> is free and takes less than
        thirty seconds.
      </div>
    </div>
  )
}
