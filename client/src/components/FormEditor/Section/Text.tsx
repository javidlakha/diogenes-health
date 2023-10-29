import TextareaAutosize from "react-textarea-autosize"

import { Transcription } from "components/Transcription/Transcription"
import { uuid } from "types"

interface TextProps {
  section_identifier: uuid
  text: string
  update_text: (section_identifier: uuid, text: string) => void
}

export function Text({ section_identifier, text, update_text }: TextProps) {
  return (
    <div className="form-editor-content">
      <TextareaAutosize
        minRows={10}
        onChange={(e) => update_text(section_identifier, e.target.value)}
        value={text}
      />
      <Transcription
        on_success={(transcription) =>
          update_text(section_identifier, `${text} ${transcription}`.trim())
        }
      />
    </div>
  )
}
