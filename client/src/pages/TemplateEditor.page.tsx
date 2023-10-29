import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { Loader } from "components/Loader"
import { Navigation } from "components/Navigation/Navigation"
import { TemplateEditor } from "components/TemplateEditor/TemplateEditor"
import { DEMO_REGISTRATION_URL } from "constants/cognito"
import {
  CREATE_NEW_TEMPLATE,
  PLACEHOLDER_TEMPLATE_NAME,
  TemplateType,
} from "constants/template"
import { UserContext, UserContextType } from "contexts/User/User.context"
import { LoginMethod } from "contexts/User/User.hooks"

interface TemplateEditorPageProps {
  template_type: TemplateType
}

export function TemplateEditorPage({ template_type }: TemplateEditorPageProps) {
  const { template_identifier = CREATE_NEW_TEMPLATE } = useParams()

  const [logged_in, set_logged_in] = useState(false)
  const { login, get_user_settings } = useContext(
    UserContext,
  ) as UserContextType
  useEffect(() => {
    get_user_settings()
      .then(() => set_logged_in(true))
      .catch(() => set_logged_in(false))
  }, [get_user_settings])

  const [register_loading, set_register_loading] = useState(false)
  const register_demo_user = async () => {
    set_register_loading(true)
    const result = await fetch(DEMO_REGISTRATION_URL!)
    const { identifier, token } = await result.json()
    await login(identifier, token, LoginMethod.DEMO)
    get_user_settings()
      .then(() => set_logged_in(true))
      .catch(() => set_logged_in(false))
    set_register_loading(false)
  }

  if (!logged_in) {
    return (
      <>
        <Navigation />
        <DemoNotice />
        <div className="template-editor">
          <Loader loading={register_loading} />
          <div className="template-editor-container">
            <div className="template-editor-header">
              <div className="template-editor-not-signed-in-notice-title">
                {PLACEHOLDER_TEMPLATE_NAME}
              </div>
              <div className="template-editor-not-signed-in-notice">
                You are not signed in. Diogenes Health is better with an account
                - you can save your forms and templates and access them from any
                device.
                <Link to="/register">Registration</Link> is free and takes less
                than thirty seconds. Or, if you prefer, you can continue as a
                guest user.
              </div>
              <div className="template-editor-not-signed-in-buttons">
                <button onClick={register_demo_user}>
                  Continue as a guest user
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <div className="page-container">
      <Navigation />
      <DemoNotice />
      <div className="content-container">
        <TemplateEditor
          template_identifier={template_identifier}
          template_type={template_type}
        />
      </div>
    </div>
  )
}
