import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faClockRotateLeft,
  faEnvelope,
  faFileWord,
  faFilePdf,
  faMessageSms,
  faPencil,
  faPrint,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons"

import { uuid } from "types"
import "./form-viewer.css"

interface OptionsProps {
  delete_form: () => void
  export_to_docx: () => void
  export_to_pdf: () => void
  form_identifier: uuid
}

export function Options({
  delete_form,
  export_to_docx,
  export_to_pdf,
  form_identifier,
}: OptionsProps) {
  const navigate = useNavigate()

  return (
    <div className="options-bar">
      <div className="options-bar-buttons">
        <button
          onClick={window.print}
          title="Print"
        >
          <FontAwesomeIcon
            icon={faPrint}
            size="2x"
          />
        </button>
        <button
          onClick={export_to_pdf}
          title="Export to PDF"
        >
          <FontAwesomeIcon
            icon={faFilePdf}
            size="2x"
          />
        </button>
        <button
          onClick={export_to_docx}
          title="Export to Microsoft Word"
        >
          <FontAwesomeIcon
            icon={faFileWord}
            size="2x"
          />
        </button>
        <button
          onClick={() => {
            navigate(`/send/${form_identifier}`)
          }}
          title="Email form"
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            size="2x"
          />
        </button>
      </div>
      <div className="options-bar-buttons">
        <button
          onClick={() => delete_form()}
          title="Delete form"
        >
          <FontAwesomeIcon
            icon={faTrashCan}
            size="2x"
          />
        </button>
        <button
          onClick={() => {
            navigate(`/audit/${form_identifier}`)
          }}
          title="Audit trail"
        >
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            size="2x"
          />
        </button>
        <button
          onClick={() => {
            navigate(`/edit/${form_identifier}`)
          }}
          title="Edit form"
        >
          <FontAwesomeIcon
            icon={faPencil}
            size="2x"
          />
        </button>
      </div>
    </div>
  )
}
