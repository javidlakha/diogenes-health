import { useContext, useEffect, useState } from "react"
import { useApolloClient } from "@apollo/client"
import { useNavigate } from "react-router-dom"

import { UserContext, UserContextType } from "contexts/User/User.context"
import "./user-settings.css"

export function UserSettings() {
  const navigate = useNavigate()
  const client = useApolloClient()
  const { get_user_settings, logout } = useContext(
    UserContext,
  ) as UserContextType

  // Get user attributes
  const [name, set_name] = useState<string>("")
  const [email, set_email] = useState<string>("")
  useEffect(() => {
    get_user_settings()
      .then((session) => {
        set_name(session.name)
        set_email(session.email)
      })
      .catch(() => set_name(""))
  }, [])

  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="title-small">{name}</div>
          <div className="subtitle">Email address</div>
          <div className="notice">{email}</div>
          <div className="subtitle">Sign out</div>
          <div className="notice">Sign out from this device.</div>
          <div className="user-settings-reset">
            <div className="large-secondary-button">
              <button
                onClick={() => {
                  logout()
                  client.resetStore()
                  navigate("/")
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
