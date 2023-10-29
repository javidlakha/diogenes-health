import { useState } from "react"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars } from "@fortawesome/pro-regular-svg-icons"

import { Logo } from "components/Logo/Logo"
import { Mode } from "./Navigation"
import "./navigation.css"

interface NavigationCompactProps {
  mode: Mode
}

export function NavigationCompact({ mode }: NavigationCompactProps) {
  const [expand_menu, set_expand_menu] = useState(false)

  return (
    <>
      <div className="navigation-compact">
        <Logo />
        <div className="navigation-menu">
          <div className={expand_menu ? "navigation-menu-active" : ""}>
            <button onClick={() => set_expand_menu(!expand_menu)}>
              <FontAwesomeIcon
                icon={faBars}
                size="2x"
                title="Export to PDF"
              />
            </button>
          </div>
        </div>
      </div>
      <div
        className="navigation-menu-expanded"
        hidden={!expand_menu}
      >
        <div className="navigation-menu-link">
          <Link to="/">Home</Link>
        </div>
        <div
          className="navigation-menu-link"
          hidden={mode === Mode.LOGGED_OUT}
        >
          <Link to="/patients">Patients</Link>
        </div>
        <div
          className="navigation-menu-link"
          hidden={mode === Mode.LOGGED_OUT}
        >
          <Link to="/templates">Templates</Link>
        </div>
        <div className="navigation-menu-link">
          <Link to="/support">Support</Link>
        </div>
        <div
          className="navigation-menu-link"
          hidden={mode !== Mode.USER}
        >
          <Link to="/user-settings">Sign out</Link>
        </div>
        <div
          className="navigation-menu-link"
          hidden={mode === Mode.USER}
        >
          <Link to="/register">Register</Link>
        </div>
        <div
          className="navigation-menu-link"
          hidden={mode === Mode.USER}
        >
          <Link to="/login">Sign in</Link>
        </div>
      </div>
    </>
  )
}
