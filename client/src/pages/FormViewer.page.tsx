import { useParams } from "react-router-dom"

import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Navigation } from "components/Navigation/Navigation"
import { FormViewer } from "components/FormViewer/FormViewer"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"

export function FormViewerPage() {
  const { form_identifier = "" } = useParams()

  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <DemoNotice />
          <FormViewer form_identifier={form_identifier} />
        </SignInPrompt>
      </div>
    </div>
  )
}
