import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Navigation } from "components/Navigation/Navigation"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"
import { SendForm } from "components/SendForm/SendForm"

export function SendFormPage() {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <DemoNotice />
          <SendForm />
        </SignInPrompt>
      </div>
    </div>
  )
}
