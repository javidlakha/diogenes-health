import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

interface ButtonProps {
  action: () => void
  icon: IconProp
  text: string
}

export function Button({ action, icon, text }: ButtonProps) {
  return (
    <div className="assistant-button">
      <button onClick={action}>
        <FontAwesomeIcon
          icon={icon}
          size="1x"
          title={text}
        />
        <div className="assistant-button-text">{text}</div>
      </button>
    </div>
  )
}
