import { NO_OBSERVATIONS } from "constants/form"
import { FormOption } from "types"

interface SingleSelectionProps {
  notes?: string
  options: FormOption[]
}

export function SingleSelection({ notes, options }: SingleSelectionProps) {
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
