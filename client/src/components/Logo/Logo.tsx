import { Link } from "react-router-dom"

import "./logo.css"

export function Logo() {
  return (
    <div className="logo">
      <div className="logo-title">
        <Link to={`/`}>Diogenes Health</Link>
      </div>
    </div>
  )
}
