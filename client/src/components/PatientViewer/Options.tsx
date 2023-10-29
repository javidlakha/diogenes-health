import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEnvelope,
  faFileWord,
  faFilePdf,
  faMessageSms,
  faPrint,
} from "@fortawesome/pro-regular-svg-icons"

import { uuid } from "types"
import "./patient-viewer.css"

interface OptionsProps {
  export_to_docx: () => void
  export_to_pdf: () => void
  patient_identifier: uuid
}

export function Options({
  export_to_docx,
  export_to_pdf,
  patient_identifier,
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
          onClick={() => alert("TODO")}
          title="Export to PDF"
        >
          <FontAwesomeIcon
            icon={faFilePdf}
            size="2x"
          />
        </button>
        <button
          onClick={() => alert("TODO")}
          title="Export to Microsoft Word"
        >
          <FontAwesomeIcon
            icon={faFileWord}
            size="2x"
          />
        </button>
        <button
          onClick={() => alert("TODO")}
          title="Email patient record"
        >
          <FontAwesomeIcon
            icon={faEnvelope}
            size="2x"
          />
        </button>
      </div>
    </div>
  )
}
