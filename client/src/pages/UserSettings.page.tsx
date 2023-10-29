import { Navigation } from "components/Navigation/Navigation"
import { SignInPrompt } from "components/SignInPrompt/SignInPrompt"
import { UserSettings } from "components/UserSettings/UserSettings"

export function UserSettingsPage() {
  return (
    <div className="page-container">
      <Navigation />
      <div className="content-container">
        <SignInPrompt>
          <UserSettings />
        </SignInPrompt>
      </div>
    </div>
  )
}
