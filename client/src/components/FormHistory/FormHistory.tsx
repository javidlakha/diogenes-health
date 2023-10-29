import { useQuery } from "@apollo/client"

import { AUDIT, FORM_METADATA } from "api/queries"
import { AuditRecord, Form, uuid } from "types"
import { Loader } from "components/Loader"
import { Options } from "./Options"
import { Record } from "./Record"
import "./form-history.css"

interface FormHistoryProps {
  form_identifier: uuid
}

export function FormHistory({ form_identifier }: FormHistoryProps) {
  const { data: form_metadata_response, loading: form_loading } = useQuery(
    FORM_METADATA,
    {
      variables: { form_identifier },
    },
  )

  const { data: audit_response, loading: audit_loading } = useQuery(AUDIT, {
    variables: { form_identifier },
  })

  const form_metadata: Form = form_metadata_response?.form
  const audit_records: AuditRecord[] = audit_response?.audit

  if (form_loading || audit_loading) return <Loader />
  if (!form_metadata || !audit_records) return null

  return (
    <div className="page">
      <div className="container">
        <div className="options-header">
          <div className="options-header-title">
            {form_metadata.patient_identifier} - {form_metadata.name}
          </div>
          <Options form_identifier={form_metadata.form_identifier} />
        </div>
        <div className="form-history-records">
          <div className="form-history-title">Audit trail</div>
          {audit_records.map((record) => (
            <Record
              form_metadata={form_metadata}
              key={record.timestamp}
              record={record}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
