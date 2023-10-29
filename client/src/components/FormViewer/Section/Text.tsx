import { NO_OBSERVATIONS } from "constants/form"

interface TextProps {
  text: string
}

export function Text({ text }: TextProps) {
  return (
    <div className="form-viewer-text">
      {text.trim() ? text : NO_OBSERVATIONS}
    </div>
  )
}
