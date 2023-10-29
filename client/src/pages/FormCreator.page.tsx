import { useParams } from "react-router-dom"

import { DemoNotice } from "components/DemoNotice/DemoNotice"
import { FormCreator } from "components/FormCreator"
import { Navigation } from "components/Navigation/Navigation"

export function FormCreatorPage() {
  const { template_identifier = "" } = useParams()

  return (
    <div className="page-container">
      <Navigation />
      <DemoNotice />
      <div className="content-container">
        <FormCreator template_identifier={template_identifier} />
      </div>
    </div>
  )
}
