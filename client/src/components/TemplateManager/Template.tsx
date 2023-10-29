import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCopy, faTrashCan } from "@fortawesome/pro-regular-svg-icons"
import { Link } from "react-router-dom"

import { uuid } from "types"

interface TemplateProps {
  delete_template: (template_identifier: uuid) => void
  duplicate_template: (template_identifier: uuid) => void
  name: string
  template_identifier: uuid
  type: "public" | "user"
}

export function Template({
  delete_template,
  duplicate_template,
  name,
  template_identifier,
  type,
}: TemplateProps) {
  return (
    <div className="template-manager-template">
      <div className="list-link">
        <Link to={`/templates/${type}/${template_identifier}`}>{name}</Link>
      </div>
      <div className="list-options">
        <div className="small-secondary-button">
          <button
            onClick={() => duplicate_template(template_identifier)}
            type="button"
          >
            <FontAwesomeIcon
              icon={faCopy}
              size="lg"
              title="Duplicate template"
            />
          </button>
        </div>
        <div className="small-secondary-button">
          <button
            onClick={() => {
              const confirm_delete = window.confirm(
                `Delete template "${name}" for all users?\n\nThere is no undo.`,
              )
              if (confirm_delete) delete_template(template_identifier)
            }}
            type="button"
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              size="lg"
              title="Delete template"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
