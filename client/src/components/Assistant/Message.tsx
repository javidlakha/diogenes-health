import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSpinner } from "@fortawesome/pro-regular-svg-icons"
import { uuid } from "types"

export interface AssistantMessage {
  content: string
  message_identifier: uuid
  role: string
}

interface MessageProps {
  message: AssistantMessage
}

export function Message({ message }: MessageProps) {
  return (
    <div className="assistant-message">
      <div className="assistant-role">{message.role}</div>
      <div className="assistant-message-content">
        {message.content
          .trim()
          .split("\n")
          .map((line, line_number) => (
            <div
              className="assistant-message-content-line"
              key={line_number}
            >
              {line}
            </div>
          ))}
      </div>
    </div>
  )
}

export function PlaceholderMessage() {
  return (
    <div className="assistant-message">
      <div className="assistant-role">Assistant</div>
      <div className="assistant-status">
        <div>
          <FontAwesomeIcon
            icon={faSpinner}
            size="xl"
            spin={true}
          />
        </div>
        <div>Thinking</div>
      </div>
    </div>
  )
}
