import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleCaretDown,
  faCircleCaretRight,
} from "@fortawesome/pro-regular-svg-icons"
import { format } from "date-fns"
import { Link } from "react-router-dom"

import { Section } from "components/FormViewer/Section"
import { Form as FormType } from "types"
import { preprocess_form } from "utils/form"
import "./patient-viewer.css"

interface FormProps {
  form: FormType
}

export function Form({ form }: FormProps) {
  form = preprocess_form(form)

  const [show, set_show] = useState(false)

  return (
    <div
      className="patient-viewer-form"
      key={form.form_identifier}
    >
      <div
        className={
          show
            ? "patient-viewer-form-header-open"
            : "patient-viewer-form-header-closed"
        }
      >
        <div className="patient-viewer-form-header">
          <div>
            <div>
              <Link to={`/view/${form.form_identifier}`}>{form.name}</Link>
            </div>
            <div>
              Last modified:{" "}
              {format(new Date(form.last_modified), "dd MMM yyyy HH:mm")}
            </div>
          </div>
          <div className="patient-viewer-form-toggle">
            <div className="small-secondary-button">
              <button
                onClick={() => set_show(!show)}
                title={show ? "Hide form" : "Show form"}
              >
                <FontAwesomeIcon
                  icon={show ? faCircleCaretDown : faCircleCaretRight}
                  size="lg"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="patient-viewer-form-body"
        hidden={!show}
      >
        <div className="patient-viewer-form-sections">
          {form.sections?.map((section) => (
            <Section
              key={section.section_identifier}
              section={section}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
