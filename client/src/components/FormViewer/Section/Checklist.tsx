import { NO_OBSERVATIONS } from "constants/form"
import { FormOption } from "types"

interface ChecklistProps {
  notes?: string
  options: FormOption[]
}

export function Checklist({ notes, options }: ChecklistProps) {
  const selected_options = options.filter((option) => option.checked)

  return (
    <>
      {selected_options.length > 0 && (
        <div className="form-viewer-list">
          <ul>
            {selected_options.map((option) => (
              <li key={option.option_identifier}>{option.name}</li>
            ))}
          </ul>
        </div>
      )}
      {notes?.trim() && <div className="form-viewer-text">{notes}</div>}
      {!selected_options.length && !notes?.trim() && (
        <div className="form-viewer-text">{NO_OBSERVATIONS}</div>
      )}
    </>
  )
}
