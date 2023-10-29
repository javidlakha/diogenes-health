import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowLeft,
  faFileCsv,
  faPrint,
} from "@fortawesome/pro-regular-svg-icons"

import { uuid } from "types"
import "./form-history.css"

interface OptionsProps {
  form_identifier: uuid
}

export function Options({ form_identifier }: OptionsProps) {
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
      </div>
      <div className="options-bar-buttons">
        <button
          onClick={() => navigate(-1)}
          title="Back"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size="2x"
          />
        </button>
      </div>
    </div>
  )
}
