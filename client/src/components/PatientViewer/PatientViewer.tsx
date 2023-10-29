import { useQuery } from "@apollo/client"

import { PATIENT_RECORD } from "api/queries"
import { Loader } from "components/Loader"
import { Form as FormType, uuid } from "types"
import { Form } from "./Form"
import { Options } from "./Options"
import "./patient-viewer.css"

interface PatientViewerProps {
  patient_identifier: uuid
}

export function PatientViewer({ patient_identifier }: PatientViewerProps) {
  // Get patient record
  const { data: patient_response, loading: patient_loading } = useQuery(
    PATIENT_RECORD,
    {
      variables: { patient_identifier },
    },
  )

  const forms: FormType[] = patient_response?.patient_record

  if (patient_loading) return <Loader />
  if (!forms) return null

  return (
    <div className="page">
      <div className="container">
        <div className="options-header">
          <div className="options-header-title">{patient_identifier}</div>
          <Options
            export_to_docx={() => {}}
            export_to_pdf={() => {}}
            patient_identifier={patient_identifier}
          />
        </div>
        {forms
          .sort((x, y) => (x.last_modified < y.last_modified ? 1 : -1))
          .map((form) => (
            <Form
              key={form.form_identifier}
              form={form}
            />
          ))}
      </div>
    </div>
  )
}
