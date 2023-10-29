import { useContext } from "react"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { UserContext, UserContextType } from "contexts/User/User.context"
import { COGNITO_ERRORS } from "constants/cognito"
import "./authentication.css"

interface SignUpForm {
  email_address: string
  name: string
  password: string
}

export function SignUp() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<SignUpForm>()

  const { create_account } = useContext(UserContext) as UserContextType

  const sign_up = (email_address: string, name: string, password: string) => {
    create_account(email_address, name, password)
      .then(() => {
        navigate("/register/confirm", { state: { email_address, password } })
      })
      .catch((error) => {
        if (error.name === COGNITO_ERRORS.UsernameExistsException) {
          setError(
            "email_address",
            { message: `${error.message}.`, type: "custom" },
            { shouldFocus: true },
          )
        } else if (error.name === COGNITO_ERRORS.InvalidParameterException) {
          setError(
            "email_address",
            { message: "Invalid email address", type: "custom" },
            { shouldFocus: true },
          )
        } else if (error.name === COGNITO_ERRORS.InvalidPasswordException) {
          setError(
            "password",
            { message: `${error.message}.`, type: "custom" },
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
            onSubmit={handleSubmit(({ email_address, name, password }) => {
              sign_up(email_address, name, password)
            })}
          >
            <div className="authentication-title">Register</div>
            <div className="authentication-label">
              <label htmlFor="name">Name</label>
            </div>
            <div
              className={
                errors?.name
                  ? "authentication-input-error"
                  : "authentication-input"
              }
            >
              <input
                {...register("name", {
                  required: "A name is required.",
                })}
              />
            </div>
            <div
              className="authentication-error-notice"
              hidden={!errors?.name}
            >
              {errors?.name?.message}
            </div>
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
                type="password"
                {...register("password", {
                  required: "A password is required.",
                  validate: {
                    minimum_length: (value) =>
                      value.length >= 8 ||
                      "Password must be at least 8 characters.",
                    uppercase_letter: (value) =>
                      /[A-Z]/.test(value) ||
                      "Password must have at least 1 uppercase letter.",
                    lowercase_letter: (value) =>
                      /[a-z]/.test(value) ||
                      "Password must have at least 1 lowercase letter.",
                    numeric_character: (value) =>
                      /[0-9]/.test(value) ||
                      "Password must have at least 1 numeric character.",
                    no_leading_or_trailing_spaces: (value) =>
                      /^[\S]+.*[\S]+$/.test(value) ||
                      "Password cannot start or end with spaces.",
                  },
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
              <button type="submit">Register</button>
            </div>
            <div className="authentication-privacy-policy">
              By registering, you agree to our{" "}
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
