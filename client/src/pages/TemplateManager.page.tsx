import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Navigation } from "components/Navigation/Navigation"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"
import { TemplateManager } from "components/TemplateManager/TemplateManager"

export function TemplateManagerPage() {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <DemoNotice />
          <TemplateManager />
        </SignInPrompt>
      </div>
    </div>
  )
}
