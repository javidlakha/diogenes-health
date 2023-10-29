import TextareaAutosize from "react-textarea-autosize"

import { TemplateEditorSection, TemplateOption } from "types"

interface SingleSelectionProps {
  change_options: (section: number, options: TemplateOption[]) => void
  index: number
  section: TemplateEditorSection
}

export function SingleSelection({
  change_options,
  index,
  section,
}: SingleSelectionProps) {
  return (
    <>
      <div className="template-editor-section-setting">
        <div className="template-editor-section-setting-title">Options</div>
        <div className="template-editor-section-setting-description">
          Enter each option on a new line
        </div>
        <TextareaAutosize
          name={`${section.section_identifier}-options`}
          minRows={3}
          onChange={(e) => {
            const options = e.target.value
              .split(/\r?\n/)
              .map((option_text) => ({
                name: option_text,
              }))

            change_options(index, options)
          }}
          value={section.options.map((option) => option.name).join("\n")}
        />
      </div>
    </>
  )
}
