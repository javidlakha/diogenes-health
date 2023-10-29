import { Navigation } from "components/Navigation/Navigation"
import { SignIn } from "components/Authentication/SignIn"

export function SignInPage() {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignIn />
      </div>
    </div>
  )
}
