import TextareaAutosize from "react-textarea-autosize"
import { uuid } from "types"

interface NotesProps {
  text: string
  section_identifier: uuid
  update_text: (section_identifier: uuid, text: string) => void
}

export function Notes({ text, section_identifier, update_text }: NotesProps) {
  return (
    <>
      <div className="form-editor-notes">Notes</div>
      <TextareaAutosize
        minRows={3}
        onChange={(e) => update_text(section_identifier, e.target.value)}
        value={text}
      />
    </>
  )
}
