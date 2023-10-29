import { Navigation } from "components/Navigation/Navigation"
import { ConfirmRegistration } from "components/Authentication/ConfirmRegistration"

export function ConfirmationPage() {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <ConfirmRegistration />
      </div>
    </div>
  )
}
