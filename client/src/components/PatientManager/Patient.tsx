import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClockRotateLeft,
  faPencil,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons"
import { format } from "date-fns"
import { Link, useNavigate } from "react-router-dom"

import { FormMetadata } from "types"

interface PatientProps {
  delete_form: (form: FormMetadata) => void
  forms: FormMetadata[]
  patient_identifier: string
}

export function Patient({
  delete_form,
  forms,
  patient_identifier,
}: PatientProps) {
  const navigate = useNavigate()

  return (
    <div
      className="patient-manager-patient"
      key={patient_identifier}
    >
      <div className="patient-manager-patient-identifier">
        <Link to={`/patients/${patient_identifier}`}>{patient_identifier}</Link>
      </div>
      <div>
        {forms
          .sort((x, y) => (x.last_modified < y.last_modified ? 1 : -1))
          .map((form) => (
            <div
              className="patient-manager-form"
              key={form.form_identifier}
            >
              <div className="patient-manager-form-metadata">
                <div className="patient-manager-form-name">
                  <Link to={`/view/${form.form_identifier}`}>{form.name}</Link>
                </div>
                <div className="patient-manager-form-last-modified">
                  <span title="Last modified">
                    {format(new Date(form.last_modified), "dd MMM yyyy HH:mm")}
                  </span>
                </div>
              </div>
              <div className="list-options">
                <div className="small-secondary-button">
                  <button
                    onClick={() => delete_form(form)}
                    title="Delete form"
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size="lg"
                    />
                  </button>
                </div>
                <div className="small-secondary-button">
                  <button
                    onClick={() => {
                      navigate(`/audit/${form.form_identifier}`)
                    }}
                    title="Audit trail"
                  >
                    <FontAwesomeIcon
                      icon={faClockRotateLeft}
                      size="lg"
                    />
                  </button>
                </div>
                <div className="small-secondary-button">
                  <button
                    onClick={() => {
                      navigate(`/edit/${form.form_identifier}`)
                    }}
                    title="Edit form"
                  >
                    <FontAwesomeIcon
                      icon={faPencil}
                      size="lg"
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
