import { useContext, useState, useEffect } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBroom,
  faPaperPlane,
  faRobot,
} from "@fortawesome/pro-regular-svg-icons"
import { Link } from "react-router-dom"
import TextareaAutosize from "react-textarea-autosize"
import useWebSocket from "react-use-websocket"
import { v4 } from "uuid"

import { Mode } from "components/DemoNotice/DemoNotice"
import { UserContext, UserContextType } from "contexts/User/User.context"
import { uuid } from "types"
import { Button } from "./Button"
import { AssistantMessage, Message, PlaceholderMessage } from "./Message"
import "./assistant.css"

const WEB_SOCKET_URL = process.env.REACT_APP_WEB_SOCKET_URL!

interface AssistantProps {
  form_identifier: uuid
}

export function Assistant({ form_identifier }: AssistantProps) {
  const [prompt, set_prompt] = useState("")
  const [messages, set_messages] = useState<AssistantMessage[]>([])
  const [waiting_for_response, set_waiting_for_response] = useState(false)
  const [response_in_progress, set_response_in_progress] = useState(false)

  const { get_tokens, get_user_settings } = useContext(
    UserContext,
  ) as UserContextType

  const { sendJsonMessage: messageServer } = useWebSocket(WEB_SOCKET_URL, {
    onMessage: async (event: MessageEvent) => {
      const { stop, update } = JSON.parse(event["data"])

      if (stop) {
        set_response_in_progress(false)
      }

      if (update && response_in_progress) {
        set_waiting_for_response(false)
        set_messages((messages) => {
          const previous_message = messages.pop()

          // If there is no previous message, create a new message from the response
          if (!previous_message) {
            return [
              { content: update, role: "assistant", message_identifier: v4() },
            ]
          }

          // If the previous message is from the user, create a new message from the response
          else if (previous_message.role === "user") {
            return [
              ...messages,
              previous_message,
              { content: update, message_identifier: v4(), role: "assistant" },
            ]
          }

          // If the previous message is from the assistant, append the response to it
          else {
            return [
              ...messages,
              {
                content: `${previous_message.content}${update}`,
                message_identifier: v4(),
                role: "assistant",
              },
            ]
          }
        })
      }
    },
  })

  const assistant = async (prompt: string) => {
    if (!prompt) return

    const token = await (await get_tokens()).getAccessToken().getJwtToken()

    const prompt_message = {
      content: prompt,
      message_identifier: v4(),
      role: "user",
    }

    messageServer({
      action: "assistant",
      messages: JSON.stringify(
        [...messages, prompt_message].map((message) => ({
          content: message.content,
          role: message.role,
        })),
      ),
      token,
      form_identifier,
    })

    set_messages((messages) => [...messages, prompt_message])
    set_waiting_for_response(true)
    set_response_in_progress(true)
  }

  // Only permit registered users to see the Assistant (the backend won't work for them)
  const [mode, set_mode] = useState<Mode>(Mode.LOGGED_OUT)
  useEffect(() => {
    get_user_settings()
      .then((settings) => {
        if (settings.demo_user) {
          set_mode(Mode.DEMO)
        } else {
          set_mode(Mode.USER)
        }
      })
      .catch(() => set_mode(Mode.LOGGED_OUT))
  }, [get_user_settings])
  if (mode !== Mode.USER) {
    return (
      <div className="assistant">
        <div className="assistant-title">Assistant</div>
        <div className="assistant-registration-required">
          The Assistant is only available to registered users.{" "}
          <Link to="/register">Registration</Link> is free and takes less than
          thirty seconds.
        </div>
      </div>
    )
  }

  return (
    <div className="assistant">
      {messages.length === 0 && (
        <div className="assistant-title">Assistant</div>
      )}
      {messages.length > 0 && (
        <div className="assistant-messages">
          {messages.map((message) => (
            <Message
              key={message.message_identifier}
              message={message}
            />
          ))}
          {waiting_for_response && <PlaceholderMessage />}
        </div>
      )}
      <div className="assistant-input-section">
        <div className="assistant-options">
          {!response_in_progress && (
            <Button
              action={() => assistant("Write a discharge summary")}
              icon={faRobot}
              text="Write a discharge summary"
            />
          )}
          {!response_in_progress && (
            <Button
              action={() =>
                assistant(
                  "Write a follow-up letter to the patient's general practitioner",
                )
              }
              icon={faRobot}
              text="Write a follow-up letter to the patient's general practitioner"
            />
          )}
          {!response_in_progress && (
            <Button
              action={() => assistant("Write a hospital transfer letter")}
              icon={faRobot}
              text="Write a hospital transfer letter"
            />
          )}
          {messages.length > 0 && !response_in_progress && (
            <Button
              action={() => {
                set_messages([])
                set_prompt("")
              }}
              icon={faBroom}
              text="Reset"
            />
          )}
        </div>
        <div
          className="assistant-input"
          style={{ position: "relative" }}
        >
          <div className="textarea">
            <TextareaAutosize
              onChange={(e) => set_prompt(e.target.value)}
              minRows={2}
              value={prompt}
            />
          </div>
          <div style={{ right: "5px", position: "absolute", bottom: "10px" }}>
            <div className="small-secondary-button">
              <button
                disabled={response_in_progress}
                hidden={response_in_progress}
                onClick={() => {
                  assistant(prompt.trim())
                  set_prompt("")
                }}
              >
                <FontAwesomeIcon
                  icon={faPaperPlane}
                  size="lg"
                  title="Ask a question"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="assistant-notice">
          The assistant is not a doctor and its responses are not medical
          advice. It is your responsibility to check its outputs
        </div>
      </div>
    </div>
  )
}
