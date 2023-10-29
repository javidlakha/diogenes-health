import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Navigation } from "components/Navigation/Navigation"
import { PatientManager } from "components/PatientManager/PatientManager"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"

export function PatientManagerPage() {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <DemoNotice />
          <PatientManager />
        </SignInPrompt>
      </div>
    </div>
  )
}
