import { useContext, useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"

import { CREATE_FORM } from "api/mutations/create_form"
import { TEMPLATE } from "api/queries/template"
import { Loader } from "components/Loader"
import { UserContext, UserContextType } from "contexts/User/User.context"
import { DEMO_REGISTRATION_URL } from "constants/cognito"
import { LoginMethod } from "contexts/User/User.hooks"
import { Template } from "types"
import "./form-creator.css"

interface CreateFormData {
  patient_email?: string
  patient_identifier: string
  person_completing: string
}

interface FormCreatorProps {
  template_identifier: string
}

export function FormCreator({ template_identifier }: FormCreatorProps) {
  const navigate = useNavigate()

  const {
    register,
    formState: { errors: form_errors },
    handleSubmit,
    reset,
    setError,
  } = useForm<CreateFormData>()

  const [show_patient_email, set_show_patient_email] = useState(false)

  // Determine if the user is signed in, or will need to create a demo account
  const [logged_in, set_logged_in] = useState(false)
  const { login, get_user_settings } = useContext(
    UserContext,
  ) as UserContextType
  useEffect(() => {
    get_user_settings()
      .then(() => set_logged_in(true))
      .catch(() => set_logged_in(false))
  }, [get_user_settings])

  // Obtain the template from which the form is to be created
  const [template, set_template] = useState<Template>()
  const { data: template_response, loading: template_loading } = useQuery(
    TEMPLATE,
    {
      variables: { template_identifier },
    },
  )
  useEffect(() => {
    reset()
    if (!template_response?.template) return
    set_template(template_response.template)
  }, [reset, template_response])

  // Creates a new form from the template
  const [create_form, { loading: create_form_loading }] =
    useMutation(CREATE_FORM)
  const create_new_form = async (form_data: CreateFormData) => {
    if (form_data.person_completing === "patient") {
      setError(
        "person_completing",
        {
          type: "custom",
        },
        { shouldFocus: false },
      )
      return
    }

    if (!logged_in) await register_demo_user()
    create_form({
      variables: {
        patient_identifier: form_data.patient_identifier,
        template_identifier,
      },
    }).then((response) => {
      const form = response.data.create_form
      const form_identifier = form.form_identifier
      navigate(`/edit/${form_identifier}`)
    })
  }

  // Registers a demo user and logs them in
  const [register_loading, set_register_loading] = useState(false)
  const register_demo_user = async () => {
    set_register_loading(true)
    const result = await fetch(DEMO_REGISTRATION_URL!)
    const { identifier, token } = await result.json()
    await login(identifier, token, LoginMethod.DEMO)
    set_register_loading(false)
  }

  // Display a spinner while the template is being fetched
  if (!template) return <Loader />

  return (
    <div className="page">
      <Loader loading={create_form_loading || register_loading} />
      <div className="container">
        <div className="header">
          <form
            method="POST"
            onSubmit={handleSubmit(create_new_form)}
          >
            <div className="title-small">{template.name}</div>
            <div className="subtitle">Patient identifier (e.g. bed number)</div>
            <div
              className={
                form_errors?.patient_identifier
                  ? "text-input-error"
                  : "text-input"
              }
            >
              <input
                type="text"
                {...register("patient_identifier", {
                  required: "A patient identifier is required.",
                })}
              />
            </div>
            <div
              className="error-notice"
              hidden={!form_errors?.patient_identifier}
            >
              {form_errors?.patient_identifier?.message}
            </div>
            <div className="subtitle">Who is completing the form?</div>
            <div className="form-creator-option-heading">I would like to</div>
            <div
              className={
                form_errors?.person_completing
                  ? "form-creator-option-error"
                  : "form-creator-option"
              }
            >
              <input
                defaultChecked
                id="clinician"
                onClick={() => set_show_patient_email(false)}
                type="radio"
                value="clinician"
                {...register("person_completing", {})}
              />
              <label htmlFor="clinician">
                enter the patient's details myself
              </label>
            </div>
            <div
              className={
                form_errors?.person_completing
                  ? "form-creator-option-error"
                  : "form-creator-option"
              }
            >
              <input
                id="patient"
                onClick={() => set_show_patient_email(true)}
                type="radio"
                value="patient"
                {...register("person_completing", {})}
              />
              <label htmlFor="patient">
                send the form to the patient to complete
              </label>
            </div>
            {form_errors?.person_completing && (
              <div
                className="error-notice"
                style={{ marginTop: "10px" }}
              >
                Unfortunately, for data protection and patient safety reasons,
                the request data from patients feature is only available to
                hospitals that have procured Diogenes Health.
              </div>
            )}
            {show_patient_email && !form_errors?.person_completing && (
              <>
                <div className="subtitle">Patient email address</div>
                <div
                  className={
                    form_errors?.patient_email
                      ? "text-input-error"
                      : "text-input"
                  }
                >
                  <input
                    type="text"
                    {...register("patient_email", {})}
                  />
                </div>
                <div
                  className="error-notice"
                  hidden={!form_errors?.patient_email}
                >
                  {form_errors?.patient_email?.message}
                </div>
              </>
            )}
            {logged_in ? (
              <div className="form-creator-buttons">
                <button>Continue</button>
              </div>
            ) : (
              <>
                <div className="form-creator-not-signed-in-notice">
                  You are not signed in. Diogenes Health is better with an
                  account - you can save your forms and templates and access
                  them from any device.
                  <Link to="/register">Registration</Link> is free and takes
                  less than thirty seconds. Or, if you prefer, you can continue
                  as a guest user.
                </div>
                <div className="form-creator-not-signed-in-button">
                  <button>Continue as a guest user</button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
