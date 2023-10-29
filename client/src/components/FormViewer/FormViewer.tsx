import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { useNavigate } from "react-router-dom"

import { DELETE_FORM } from "api/mutations"
import { EXPORT, FORM } from "api/queries"
import { Assistant } from "components/Assistant/Assistant"
import { Loader } from "components/Loader"
import { Form, uuid } from "types"
import { preprocess_form } from "utils/form"
import { Section } from "./Section"
import { Options } from "./Options"
import "./form-viewer.css"
import { download_file } from "./utils"

interface FormViewerProps {
  form_identifier: uuid
}

export function FormViewer({ form_identifier }: FormViewerProps) {
  const navigate = useNavigate()

  // Get form
  const { data: form_response, loading: form_loading } = useQuery(FORM, {
    variables: { form_identifier },
  })
  const form: Form = form_response?.form && preprocess_form(form_response?.form)

  // Export form
  const [export_request, { loading: export_loading }] = useLazyQuery(EXPORT)
  const export_to_docx = async () => {
    const export_to_docx_response = await export_request({
      variables: { form_identifier, format: "docx" },
    })
    download_file(export_to_docx_response?.data.export)
  }
  const export_to_pdf = async () => {
    const export_to_pdf_response = await export_request({
      variables: { form_identifier, format: "pdf" },
    })
    download_file(export_to_pdf_response?.data.export)
  }

  // Delete form
  const [delete_form_mutation] = useMutation(DELETE_FORM, {})
  const delete_form = async () => {
    const confirm_delete = window.confirm(
      `Delete "${form.patient_identifier} - ${form.name}"?\n\nThere is no undo.`,
    )
    if (confirm_delete) {
      await delete_form_mutation({
        variables: {
          form_identifier: form.form_identifier,
        },
      })
      navigate("/patients")
    }
  }

  if (form_loading) return <Loader />
  if (!form) return null

  return (
    <div className="page">
      <Loader loading={export_loading} />
      <div className="container">
        <div className="options-header">
          <div className="options-header-title">
            {form.patient_identifier} - {form.name}
          </div>
          <Options
            delete_form={delete_form}
            export_to_docx={export_to_docx}
            export_to_pdf={export_to_pdf}
            form_identifier={form_identifier}
          />
        </div>
        <div className="form-viewer-sections">
          {form.sections.map((section) => (
            <Section
              key={section.section_identifier}
              section={section}
            />
          ))}
        </div>
        <Assistant form_identifier={form_identifier} />
      </div>
    </div>
  )
}
