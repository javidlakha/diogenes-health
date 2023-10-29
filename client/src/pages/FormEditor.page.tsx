import { useParams } from "react-router-dom"

import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { FormEditor } from "components/FormEditor/FormEditor"
import { Navigation } from "components/Navigation/Navigation"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"

export function FormEditorPage() {
  const { form_identifier = "" } = useParams()

  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <DemoNotice />
          <FormEditor form_identifier={form_identifier} />
        </SignInPrompt>
      </div>
    </div>
  )
}
