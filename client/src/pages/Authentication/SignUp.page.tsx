import { Navigation } from "components/Navigation/Navigation"
import { SignUp } from "components/Authentication/SignUp"

export function SignUpPage() {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignUp />
      </div>
    </div>
  )
}
