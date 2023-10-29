import { useParams } from "react-router-dom"

import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Navigation } from "components/Navigation/Navigation"
import { FormHistory } from "components/FormHistory/FormHistory"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"

export function AuditPage() {
  const { form_identifier = "" } = useParams()

  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <DemoNotice />
          <FormHistory form_identifier={form_identifier} />
        </SignInPrompt>
      </div>
    </div>
  )
}
