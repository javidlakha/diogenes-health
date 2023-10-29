import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan, faFloppyDisk, faPlus } from "@fortawesome/pro-regular-svg-icons"
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd"
import { useNavigate } from "react-router-dom"

import { CREATE_TEMPLATE, UPDATE_TEMPLATE } from "api/mutations"
import { TEMPLATE, TEMPLATES } from "api/queries"
import { Loader } from "components/Loader"
import {
  CREATE_NEW_TEMPLATE,
  PLACEHOLDER_TEMPLATE_NAME,
  TemplateType,
} from "constants/template"
import { NEW_TEMPLATE } from "data/templates"
import { Template, TemplateOption, uuid } from "types"
import { Section } from "./Section"
import { create_empty_section, preprocess_template } from "utils/template"
import "./template-editor.css"

interface TemplateEditorProps {
  template_identifier: uuid
  template_type: TemplateType
}

export function TemplateEditor({
  template_identifier,
  template_type,
}: TemplateEditorProps) {
  const navigate = useNavigate()
  const [template, set_template] = useState(() => {
    if (template_identifier === CREATE_NEW_TEMPLATE) {
      return preprocess_template(NEW_TEMPLATE as Template)
    }
  })

  const [create_template] = useMutation(CREATE_TEMPLATE, {
    refetchQueries: [
      { query: TEMPLATES },
      "templates",
      { query: TEMPLATE },
      "template",
    ],
  })

  const [update_template] = useMutation(UPDATE_TEMPLATE, {
    refetchQueries: [
      { query: TEMPLATES },
      "templates",
      { query: TEMPLATE },
      "template",
    ],
  })

  const { data: template_response } = useQuery(TEMPLATE, {
    variables: { template_identifier },
  })
  useEffect(() => {
    if (!template_response?.template) return
    set_template(preprocess_template(template_response.template))
  }, [template_response])

  const on_drag_end = (result: DropResult) => {
    if (!template) return
    const { destination, source } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    const sections_to_move = template.sections.splice(source.index, 1)
    if (sections_to_move === undefined || sections_to_move.length === 0) return
    template.sections.splice(destination.index, 0, sections_to_move[0])
    set_template({ ...template, sections: template.sections })
  }

  const add_section = () => {
    if (!template) return
    template.sections.push(create_empty_section())
    set_template({ ...template })
  }

  const change_diagram = (section_number: number, diagram: uuid) => {
    if (!template) return
    set_template({
      ...template,
      sections: template.sections.map((section, index) =>
        index === section_number
          ? {
              ...section,
              background: diagram,
            }
          : section,
      ),
    })
  }

  const change_options = (
    section_number: number,
    options: TemplateOption[],
  ) => {
    if (!template) return
    set_template({
      ...template,
      sections: template.sections.map((section, index) =>
        index === section_number
          ? {
              ...section,
              options,
            }
          : section,
      ),
    })
  }

  const change_section_description = (
    section_number: number,
    description: string,
  ) => {
    if (!template) return
    set_template({
      ...template,
      sections: template.sections.map((section, index) =>
        index === section_number
          ? {
              ...section,
              description,
            }
          : section,
      ),
    })
  }

  const change_section_type = (section_number: number, type: string) => {
    if (!template) return
    set_template({
      ...template,
      sections: template.sections.map((section, index) =>
        index === section_number
          ? {
              ...section,
              type,
            }
          : section,
      ),
    })
  }

  const delete_section = (section_number: number) => {
    if (!template) return
    set_template({
      ...template,
      sections: template.sections.filter(
        (section, index) => index !== section_number,
      ),
    })
  }

  const rename_section = (section_number: number, name: string) => {
    if (!template) return
    set_template({
      ...template,
      sections: template.sections.map((section, index) =>
        index === section_number
          ? {
              ...section,
              name,
            }
          : section,
      ),
    })
  }

  const rename_template = (name: string) => {
    if (!template) return
    set_template({
      ...template,
      name,
    })
  }

  const save_template = () => {
    if (!template) return
    if (template_identifier === CREATE_NEW_TEMPLATE) {
      create_template({
        variables: {
          name: template.name,
          public: template_type === TemplateType.PUBLIC,
          sections: template.sections.map((section) => ({
            background: section.background,
            description: section.description,
            name: section.name,
            options: section.options?.map((option) => ({
              name: option.name,
            })),
            type: section.type,
          })),
        },
      }).then(() => navigate(-1))
    } else {
      update_template({
        variables: {
          name: template.name,
          sections: template.sections.map((section) => ({
            background: section.background,
            description: section.description,
            name: section.name,
            options: section.options?.map((option) => ({
              name: option.name,
            })),
            type: section.type,
          })),
          public: template_type === TemplateType.PUBLIC,
          template_identifier,
        },
      }).then(() => navigate(-1))
    }
  }

  if (!template) return <Loader />
  return (
    <div className="template-editor">
      <div className="template-editor-container">
        <div className="template-editor-header">
          <div className="template-editor-title">
            <input
              onBlur={(e) => {
                if (e.target.value === "")
                  rename_template(PLACEHOLDER_TEMPLATE_NAME)
              }}
              onChange={(e) => {
                if (e.target.value !== undefined)
                  rename_template(e.target.value)
              }}
              type="text"
              value={template.name}
            />
          </div>
          <div className="template-editor-options">
            {template_type === TemplateType.PUBLIC && (
              <div className="template-editor-notice">
                This is a public template that will be available to everyone
              </div>
            )}
            <div className="template-editor-cancel">
              <button
                onClick={() => navigate(-1)}
                title="Cancel"
              >
                <FontAwesomeIcon
                  icon={faBan}
                  size="xl"
                />
              </button>
            </div>
            <div className="template-editor-save">
              <button
                onClick={save_template}
                title="Save and exit"
              >
                <FontAwesomeIcon
                  icon={faFloppyDisk}
                  size="xl"
                />
              </button>
            </div>
          </div>
        </div>
        <DragDropContext onDragEnd={on_drag_end}>
          <div className="template-editor-sections-container">
            <Droppable droppableId={"template-editor-sections-droppable"}>
              {(provided) => (
                <div
                  className="template-editor-section-wrapper"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {template.sections.map((section, index) => (
                    <Section
                      change_diagram={change_diagram}
                      change_options={change_options}
                      change_section_description={change_section_description}
                      change_section_type={change_section_type}
                      delete_section={delete_section}
                      index={index}
                      key={section.section_identifier}
                      rename_section={rename_section}
                      section={section}
                    />
                  ))}
                  {provided.placeholder}
                  <div className="footer-button">
                    <button
                      onClick={add_section}
                      title="Add section"
                    >
                      <FontAwesomeIcon
                        icon={faPlus}
                        size="2x"
                      />
                    </button>
                  </div>
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
    </div>
  )
}
