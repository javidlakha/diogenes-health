import { useContext, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom"

import { UserContext, UserContextType } from "contexts/User/User.context"
import { COGNITO_ERRORS } from "constants/cognito"
import "./authentication.css"

interface ConfirmationCodeForm {
  confirmation_code: string
}

export function ConfirmRegistration() {
  const navigate = useNavigate()

  const { state } = useLocation()
  const email_address = state?.email_address
  const password = state?.password
  useEffect(() => {
    if (!email_address || !password) {
      navigate("/login")
    }
  })

  const { confirm_registration, login } = useContext(
    UserContext,
  ) as UserContextType

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ConfirmationCodeForm>()

  const confirm = (confirmation_code: string) => {
    confirm_registration(email_address, confirmation_code)
      .then(sign_in)
      .catch((error) => {
        if (error.name === COGNITO_ERRORS.CodeMismatchException) {
          setError(
            "confirmation_code",
            { message: error.message, type: "custom" },
            { shouldFocus: true },
          )
        } else if (
          error.name === COGNITO_ERRORS.UserAlreadyConfirmed.name &&
          error.message === COGNITO_ERRORS.UserAlreadyConfirmed.message
        ) {
          sign_in()
        }
      })
  }

  const sign_in = () => {
    login(email_address, password)
      .then(() => {
        navigate("/")
      })
      .catch(() => {
        navigate("/login")
      })
  }

  return (
    <div className="authentication-page">
      <div className="authentication-container">
        <div className="authentication-form">
          <form
            onSubmit={handleSubmit(({ confirmation_code }) => {
              confirm(confirmation_code)
            })}
          >
            <div className="authentication-title">Confirmation</div>
            <div className="authentication-notice">
              We need to verify your email address. A confirmation code has been
              sent to {email_address}. Please enter this code below.
            </div>
            <div className="authentication-label">
              <label htmlFor="email_address">Confirmation code</label>
            </div>
            <div
              className={
                errors?.confirmation_code
                  ? "authentication-input-error"
                  : "authentication-input"
              }
            >
              <input
                autoComplete="one-time-code"
                {...register("confirmation_code", {
                  required: "A confirmation code is required.",
                })}
              />
            </div>
            <div
              className="authentication-error-notice"
              hidden={!errors?.confirmation_code}
            >
              {errors?.confirmation_code?.message}
            </div>
            <div className="authentication-buttons">
              <button type="submit">Confirm</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
