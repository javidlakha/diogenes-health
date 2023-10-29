import { useMutation, useQuery } from "@apollo/client"

import { FORMS } from "api/queries/forms"
import { DELETE_FORM } from "api/mutations/delete_form"
import { Loader } from "components/Loader"
import { FormMetadata } from "types"
import { Patient } from "./Patient"
import "./patient-manager.css"

export function PatientManager() {
  // Get patient records
  const { data: forms_response, loading: forms_loading } = useQuery(FORMS)
  const forms: FormMetadata[] = forms_response?.forms

  const [delete_form_mutation] = useMutation(DELETE_FORM, {
    refetchQueries: [{ query: FORMS }, "forms"],
  })
  const delete_form = async (form: FormMetadata) => {
    const confirm_delete = window.confirm(
      `Delete "${form.patient_identifier} - ${form.name}"?\n\nThere is no undo.`,
    )
    if (confirm_delete) {
      await delete_form_mutation({
        variables: {
          form_identifier: form.form_identifier,
        },
      })
    }
  }

  // Display a spinner while the patient records are being fetched
  if (forms_loading) {
    return <Loader />
  }

  if (!forms) return null
  const patient_identifiers = forms.map((form) => form.patient_identifier)
  const unique_patients = [...new Set(patient_identifiers)]

  return (
    <div className="page">
      <div className="container">
        <div className="list">
          <div className="list-title">Patients</div>
        </div>
        {unique_patients
          .sort((x, y) => x.localeCompare(y))
          .map((patient_identifier) => (
            <Patient
              delete_form={delete_form}
              forms={forms.filter(
                (form) => form.patient_identifier === patient_identifier,
              )}
              key={patient_identifier}
              patient_identifier={patient_identifier}
            />
          ))}
      </div>
    </div>
  )
}
