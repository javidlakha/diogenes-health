import { useContext, useEffect, useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import { useLazyQuery, useQuery } from "@apollo/client"
import { useForm } from "react-hook-form"

import { FORM } from "api/queries/form"
import { SEND } from "api/queries/send"
import { Loader } from "components/Loader"
import { UserContext, UserContextType } from "contexts/User/User.context"
import { Form } from "types"
import "./SendForm.UI.css"

enum Format {
  DOCX = "DOCX",
  PDF = "PDF",
}

enum Mode {
  LOGGED_OUT = "LOGGED_OUT",
  USER = "USER",
  DEMO = "DEMO",
}

interface SendFormData {
  format: Format
  to: string
  not_registered: string
}

export function SendForm() {
  const navigate = useNavigate()
  const { form_identifier = "" } = useParams()

  const [mode, set_mode] = useState<Mode>()
  const { get_user_settings } = useContext(UserContext) as UserContextType
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

  const { data: form_response, loading: form_loading } = useQuery(FORM, {
    variables: { form_identifier },
  })

  const form: Form = form_response?.form

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SendFormData>()

  const [email_document_request, { loading }] = useLazyQuery(SEND)

  const send = async (data: SendFormData) => {
    if (mode !== Mode.USER) {
      setError("not_registered", {})
    }

    if (data.format === Format.DOCX) {
      await email_document_request({
        variables: { form_identifier, format: "docx", to: data.to },
      })
    }

    if (data.format === Format.PDF) {
      await email_document_request({
        variables: { form_identifier, format: "pdf", to: data.to },
      })
    }
  }

  const cancel = () => {
    navigate(`/view/${form_identifier}`)
  }

  if (form_loading || !mode) {
    return <Loader />
  }

  if (!form) {
    return null
  }

  return (
    <div className="send-form">
      <Loader loading={loading} />
      <div className="send-form-container">
        <div className="send-form-body">
          <div className="send-form-title">
            {form.patient_identifier} - {form.name}
          </div>
          <div>
            <form onSubmit={handleSubmit(() => {})}>
              <div className="send-form-label">Format</div>
              <div className="send-form-radio">
                <div
                  className="send-form-radio-option"
                  key={Format.DOCX}
                >
                  <input
                    defaultChecked={true}
                    id={Format.DOCX}
                    type="radio"
                    value={Format.DOCX}
                    {...register("format", {})}
                  />
                  <label htmlFor={Format.DOCX}>Microsoft Word</label>
                </div>
                <div
                  className="send-form-radio-option"
                  key={Format.PDF}
                >
                  <input
                    id={Format.PDF}
                    type="radio"
                    value={Format.PDF}
                    {...register("format", {})}
                  />
                  <label htmlFor={Format.PDF}>PDF</label>
                </div>
              </div>
              <div className="send-form-label">
                <label htmlFor="to">Recipient email address</label>
              </div>
              <div
                className={
                  errors?.to ? "send-form-input-error" : "send-form-input"
                }
              >
                <input
                  {...register("to", {
                    required: "An email address is required.",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "The email address entered is not valid.",
                    },
                  })}
                />
              </div>
              <div
                className="send-form-error-notice"
                hidden={!errors?.to}
              >
                {errors?.to?.message}
              </div>
              <div
                className="send-form-not-registered-notice"
                hidden={!errors?.not_registered}
              >
                To send a document, you must first{" "}
                <Link to="/register">register</Link>.
              </div>
              <div className="send-form-buttons">
                <div className="send-form-cancel">
                  <button
                    onClick={cancel}
                    type="button"
                  >
                    Cancel
                  </button>
                </div>
                <div className="send-form-save">
                  <button onClick={handleSubmit(send)}>Send</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
