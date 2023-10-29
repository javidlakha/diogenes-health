import { v4 } from "uuid"
import TextareaAutosize from "react-textarea-autosize"

import { Notes } from "components/FormEditor/Notes/Notes"
import { FormOption, uuid } from "types"

interface SingleSelectionProps {
  change_options: (section_identifier: uuid, options: FormOption[]) => void
  edit_mode: boolean
  options: FormOption[]
  section_identifier: uuid
  text: string
  update_single_selection: (
    section_identifier: uuid,
    option_identifier: uuid,
  ) => void
  update_text: (section_identifier: uuid, text: string) => void
}

export function SingleSelection({
  change_options,
  edit_mode,
  options,
  section_identifier,
  text,
  update_single_selection,
  update_text,
}: SingleSelectionProps) {
  if (edit_mode)
    return (
      <div className="form-editor-setting">
        <div className="form-editor-setting-title">Options</div>
        <div className="form-editor-setting-description">
          Enter each option on a new line
        </div>
        <TextareaAutosize
          name={`${section_identifier}-options`}
          minRows={3}
          onChange={(e) => {
            const options = e.target.value
              .split(/\r?\n/)
              .map((option_text) => ({
                checked: false,
                name: option_text,
                option_identifier: v4(),
              }))

            change_options(section_identifier, options)
          }}
          value={options.map((option) => option.name).join("\n")}
        />
      </div>
    )

  return (
    <div className="form-editor-content">
      {options.map((option) => (
        <div
          className="form-editor-content-option"
          key={option.option_identifier}
        >
          <input
            checked={option.checked}
            id={option.option_identifier}
            onChange={() => {}} // Suppress error message
            onClick={() => {
              update_single_selection(
                section_identifier,
                option.option_identifier,
              )
            }} // Clear option by selecting it
            type="radio"
          />
          <label htmlFor={option.option_identifier}>{option.name}</label>
        </div>
      ))}
      <Notes
        text={text}
        section_identifier={section_identifier}
        update_text={update_text}
      />
    </div>
  )
}
