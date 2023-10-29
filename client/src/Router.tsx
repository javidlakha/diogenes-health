import { BrowserRouter } from "react-router-dom"
import { Route, Routes } from "react-router-dom"

import { TemplateType } from "constants/template"
import { AuditPage } from "pages/Audit.page"
import { FormCreatorPage } from "pages/FormCreator.page"
import { FormEditorPage } from "pages/FormEditor.page"
import { FormViewerPage } from "pages/FormViewer.page"
import { PatientManagerPage } from "pages/PatientManager.page"
import { PatientViewerPage } from "pages/PatientViewer.page"
import { SendFormPage } from "pages/SendForm.page"
import { TemplateEditorPage } from "pages/TemplateEditor.page"
import { TemplateManagerPage } from "pages/TemplateManager.page"
import { UserSettingsPage } from "pages/UserSettings.page"
import { ConfirmationPage } from "pages/Authentication/Confirmation.page"
import { SignInPage } from "pages/Authentication/SignIn.page"
import { SignUpPage } from "pages/Authentication/SignUp.page"
import { NotFoundErrorPage } from "pages/ErrorPages/NotFound.page"
import { Homepage } from "pages/Home/Home.page"

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Homepage />}
        />
        <Route
          path={"audit/:form_identifier/"}
          element={<AuditPage />}
        />
        <Route
          path={"create/:template_identifier"}
          element={<FormCreatorPage />}
        />
        <Route
          path={"edit/:form_identifier"}
          element={<FormEditorPage />}
        />
        <Route
          path={"login"}
          element={<SignInPage />}
        />
        <Route
          path={"patients"}
          element={<PatientManagerPage />}
        />
        <Route
          path={"patients/:patient_identifier"}
          element={<PatientViewerPage />}
        />
        <Route
          path={"register"}
          element={<SignUpPage />}
        />
        <Route
          path={"register/confirm"}
          element={<ConfirmationPage />}
        />
        <Route
          path={"send/:form_identifier/"}
          element={<SendFormPage />}
        />
        <Route
          path={"templates"}
          element={<TemplateManagerPage />}
        />
        <Route
          path={"templates/public/:template_identifier"}
          element={<TemplateEditorPage template_type={TemplateType.PUBLIC} />}
        />
        <Route
          path={"templates/user/:template_identifier"}
          element={<TemplateEditorPage template_type={TemplateType.USER} />}
        />
        <Route
          path={"user-settings"}
          element={<UserSettingsPage />}
        />
        <Route
          path={"view/:form_identifier/"}
          element={<FormViewerPage />}
        />
        <Route
          path="*"
          element={<NotFoundErrorPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}
