import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleCaretRight } from "@fortawesome/pro-regular-svg-icons"
import { format } from "date-fns"

import { AuditRecord, FormMetadata } from "types"
import "./form-history.css"

function audit_verb(action: string): string {
  switch (action) {
    case "create_form":
      return "created"
    case "delete_form":
      return "deleted"
    case "update_form":
      return "updated"
    default:
      return action
  }
}

interface RecordProps {
  form_metadata: FormMetadata
  record: AuditRecord
}

export function Record({ form_metadata, record }: RecordProps) {
  return (
    <div
      className="form-history-record"
      key={record.timestamp}
    >
      <div className="form-history-record-metadata">
        <div className="form-history-record-action">
          {record.user.name} {audit_verb(record.action)} {form_metadata.name}
        </div>
        <div className="form-history-record-timestamp">
          {format(new Date(record.timestamp), "dd MMM yyyy HH:mm")}
        </div>
      </div>
      <div className="form-history-record-metadata-mobile">
        {record.user.name} {audit_verb(record.action)} {form_metadata.name} -{" "}
        {format(new Date(record.timestamp), "dd MMM yyyy HH:mm")}
      </div>
      <div className="form-history-record-options"></div>
    </div>
  )
}
