import { useContext } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { UserContext, UserContextType } from "contexts/User/User.context"
import { COGNITO_ERRORS } from "constants/cognito"
import "./authentication.css"

interface SignInForm {
  email_address: string
  password: string
}

interface SignInProps {
  on_sign_in?: () => void
}

export function SignIn({ on_sign_in }: SignInProps) {
  const navigate = useNavigate()

  const { login } = useContext(UserContext) as UserContextType
  if (!on_sign_in) on_sign_in = () => navigate("/")

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignInForm>()

  const sign_in = (email_address: string, password: string) => {
    login(email_address, password)
      .then(on_sign_in)
      .catch((error) => {
        if (
          error.name === COGNITO_ERRORS.UserNotFoundException.name &&
          error.message === COGNITO_ERRORS.UserNotFoundException.message
        ) {
          setError(
            "email_address",
            { message: error.message, type: "custom" },
            { shouldFocus: true },
          )
        } else if (error.name === COGNITO_ERRORS.InvalidParameterException) {
          setError(
            "email_address",
            {
              message: "The email address entered is not valid.",
              type: "custom",
            },
            { shouldFocus: true },
          )
        } else if (
          error.name === COGNITO_ERRORS.IncorrectCredentials.name &&
          error.message === COGNITO_ERRORS.IncorrectCredentials.message
        ) {
          setError(
            "password",
            { message: error.message, type: "custom" },
            { shouldFocus: true },
          )
        } else {
          console.error(error)
        }
      })
  }

  return (
    <div className="authentication-page">
      <div className="authentication-container">
        <div className="authentication-form">
          <form
            onSubmit={handleSubmit(({ email_address, password }) => {
              sign_in(email_address.trim(), password.trim())
            })}
          >
            <div className="authentication-title">Sign in</div>
            <div className="authentication-label">
              <label htmlFor="email_address">Email address</label>
            </div>
            <div
              className={
                errors?.email_address
                  ? "authentication-input-error"
                  : "authentication-input"
              }
            >
              <input
                autoComplete="username"
                {...register("email_address", {
                  required: "An email address is required.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "The email address entered is not valid.",
                  },
                })}
              />
            </div>
            <div
              className="authentication-error-notice"
              hidden={!errors?.email_address}
            >
              {errors?.email_address?.message}
            </div>
            <div className="authentication-label">
              <label htmlFor="password">Password</label>
            </div>
            <div
              className={
                errors?.password
                  ? "authentication-input-error"
                  : "authentication-input"
              }
            >
              <input
                autoComplete="new-password"
                type="password"
                {...register("password", {
                  required: "A password is required.",
                })}
              />
            </div>
            <div
              className="authentication-error-notice"
              hidden={!errors?.password}
            >
              {errors?.password?.message}
            </div>
            <div className="authentication-buttons">
              <button type="submit">Sign in</button>
            </div>
            <div className="authentication-privacy-policy">
              By signing in, you agree to our{" "}
              <Link
                rel="noopener noreferrer"
                target="_blank"
                to="/terms-of-use"
              >
                Terms of Use
              </Link>{" "}
              and our{" "}
              <Link
                rel="noopener noreferrer"
                target="_blank"
                to="/privacy-policy"
              >
                Privacy Policy
              </Link>
              .
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
