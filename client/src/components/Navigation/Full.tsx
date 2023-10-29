import { Link } from "react-router-dom"

import { Logo } from "components/Logo/Logo"
import { Mode } from "./Navigation"
import "./navigation.css"

interface NavigationFullProps {
  mode: Mode
}

export function NavigationFull({ mode }: NavigationFullProps) {
  return (
    <>
      <div className="navigation-full">
        <div className="navigation-links-left">
          <div className="navigation-link">
            <Link to="/">Home</Link>
          </div>
          <div
            className="navigation-link"
            hidden={mode === Mode.LOGGED_OUT}
          >
            <Link to="/patients">Patients</Link>
          </div>
          <div
            className="navigation-link"
            hidden={mode === Mode.LOGGED_OUT}
          >
            <Link to="/templates">Templates</Link>
          </div>
          <div
            className="navigation-link"
            hidden={mode === Mode.LOGGED_OUT}
          >
            <Link to="/support">Support</Link>
          </div>
        </div>
        <div
          className="navigation-logo"
          style={{ flex: "1 1 auto", display: "flex" }}
        >
          <div style={{ marginLeft: "auto", marginRight: "auto" }}>
            <Logo />
          </div>
        </div>
        <div className="navigation-links-right">
          <div
            className="navigation-link"
            hidden={mode !== Mode.USER}
          >
            <Link to="/user-settings">Sign out</Link>
          </div>
          <div
            className="navigation-link"
            hidden={mode === Mode.USER}
          >
            <Link to="/register">Register</Link>
          </div>
          <div
            className="navigation-link"
            hidden={mode === Mode.USER}
          >
            <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  )
}
