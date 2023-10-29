import { useContext, useEffect, useState } from "react"
import { useLazyQuery, useMutation, useQuery } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/pro-regular-svg-icons"
import { useNavigate } from "react-router-dom"

import { CREATE_TEMPLATE, DELETE_TEMPLATE } from "api/mutations"
import { TEMPLATE, TEMPLATES } from "api/queries"
import { Loader } from "components/Loader"
import { COGNITO_USER_GROUPS } from "constants/cognito"
import { UserContext, UserContextType } from "contexts/User/User.context"
import { CREATE_NEW_TEMPLATE, TemplateType } from "constants/template"
import { TemplateMetadata, uuid } from "types"
import { preprocess_template } from "utils/template"
import { Template } from "./Template"
import "./template-manager.css"

export function TemplateManager() {
  const navigate = useNavigate()

  // Get the list of templates to which the user has access
  const { data, loading: templates_loading } = useQuery(TEMPLATES)
  const templates: TemplateMetadata[] = data?.templates || []

  // Determine if the user has access to the public template editor APIs
  const { get_user_settings } = useContext(UserContext) as UserContextType
  const [user_groups, set_user_groups] = useState<string[]>([])
  useEffect(() => {
    get_user_settings()
      .then((session) => set_user_groups(session.groups))
      .catch(() => set_user_groups([]))
  }, [get_user_settings])
  const public_template_editor = user_groups.includes(
    COGNITO_USER_GROUPS.TemplateEditors,
  )

  // Add template
  const add_user_template = () => {
    navigate(`/templates/user/${CREATE_NEW_TEMPLATE}`)
  }

  const add_public_template = () => {
    navigate(`/templates/public/${CREATE_NEW_TEMPLATE}`)
  }

  // Delete template
  const [delete_template_mutation, { loading: delete_template_loading }] =
    useMutation(DELETE_TEMPLATE, {
      refetchQueries: [{ query: TEMPLATES }, "templates"],
    })
  const delete_template = (template_identifier: uuid) => {
    delete_template_mutation({
      variables: {
        template_identifier,
      },
    })
  }

  // Duplicate template
  const [template_query] = useLazyQuery(TEMPLATE)
  const [create_template_mutation] = useMutation(CREATE_TEMPLATE, {
    refetchQueries: [{ query: TEMPLATES }, "templates"],
  })
  const duplicate_template = async (template_identifier: uuid) => {
    const { data } = await template_query({
      variables: {
        template_identifier,
      },
    })
    const template = data?.template
    if (!template) return
    create_template_mutation({
      variables: {
        name: template.name,
        public: template.type === TemplateType.PUBLIC,
        sections: preprocess_template(template).sections.map((section) => ({
          background: section.background,
          description: section.description,
          name: section.name,
          options: section.options?.map((option) => ({
            name: option.name,
          })),
          type: section.type,
        })),
      },
    })
  }

  return (
    <div className="page">
      <Loader loading={templates_loading || delete_template_loading} />
      <div className="container">
        {public_template_editor && (
          <>
            <div className="list">
              <div className="list-title">Public Templates</div>
              <div className="template-manager-notice">
                These templates are available to everyone
              </div>
              {templates
                .filter((template) => template.type === "public")
                .sort((a, b) => a.name.trim().localeCompare(b.name.trim()))
                .map((template) => (
                  <Template
                    delete_template={delete_template}
                    duplicate_template={duplicate_template}
                    key={template.template_identifier}
                    name={template.name}
                    template_identifier={template.template_identifier}
                    type="public"
                  />
                ))}
            </div>
            <div className="footer-button">
              <button onClick={add_public_template}>
                <FontAwesomeIcon
                  icon={faPlus}
                  size="2x"
                  title="Add public template"
                />
              </button>
            </div>
            <div className="spacer" />
          </>
        )}
        <div className="list">
          <div className="list-title">
            {public_template_editor ? "User Templates" : "Templates"}
          </div>
          {templates
            .filter((template) => template.type === "user")
            .sort((a, b) => a.name.trim().localeCompare(b.name.trim()))
            .map((template) => (
              <Template
                delete_template={delete_template}
                duplicate_template={duplicate_template}
                key={template.template_identifier}
                name={template.name}
                template_identifier={template.template_identifier}
                type="user"
              />
            ))}
        </div>
        <div className="footer-button">
          <button onClick={add_user_template}>
            <FontAwesomeIcon
              icon={faPlus}
              size="2x"
              title="Add template"
            />
          </button>
        </div>
      </div>
    </div>
  )
}
