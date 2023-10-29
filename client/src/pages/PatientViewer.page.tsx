import { useParams } from "react-router-dom"

import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Navigation } from "components/Navigation/Navigation"
import { PatientViewer } from "components/PatientViewer/PatientViewer"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"

export function PatientViewerPage() {
  const { patient_identifier = "" } = useParams()

  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <DemoNotice />
          <PatientViewer patient_identifier={patient_identifier} />
        </SignInPrompt>
      </div>
    </div>
  )
}
