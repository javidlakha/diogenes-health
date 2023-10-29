import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import DropdownMenu, {
  DropdownItem,
  DropdownItemGroup,
} from "@atlaskit/dropdown-menu"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faArrowRight,
  faBarsStaggered,
  faPlus,
} from "@fortawesome/pro-regular-svg-icons"
import { format } from "date-fns"
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd"
import { useNavigate } from "react-router-dom"
import { v4 } from "uuid"

import { UPDATE_FORM } from "api/mutations"
import { FORM } from "api/queries"
import { BLANK_CANVAS } from "assets/diagrams"
import { Loader } from "components/Loader"
import {
  AUTOSAVE_INTERVAL,
  FORM_TYPES,
  NEW_SECTION_NAMES,
  PLACEHOLDER_PATIENT_IDENTIFIER,
  PLACEHOLDER_FORM_NAME,
} from "constants/form"
import {
  ChecklistSection,
  DiagramSection,
  Form,
  FormOption,
  SingleSelectionSection,
  TextSection,
  uuid,
} from "types"
import { Section } from "./Section"
import "./form-editor.css"
import { preprocess_form } from "utils/form"

interface FormEditorProps {
  form_identifier: uuid
}

export function FormEditor({ form_identifier }: FormEditorProps) {
  const navigate = useNavigate()
  const [form, set_form] = useState<Form>()
  const [reorder_mode, set_reorder_mode] = useState(false)

  // Get form
  const { data: form_response } = useQuery(FORM, {
    variables: { form_identifier },
  })
  useEffect(() => {
    if (!form_response?.form) return
    set_form(preprocess_form(form_response.form))
  }, [form_response])

  // Save form
  const [update_form] = useMutation(UPDATE_FORM)
  const [last_saved, set_last_saved] = useState(new Date())
  const save_form = async () => {
    if (!form) return

    await update_form({
      variables: {
        form: {
          form_identifier: form.form_identifier,
          name: form.name,
          patient_identifier: form.patient_identifier,
          sections: form.sections.map((section) => {
            if (section.type === FORM_TYPES.CHECKLIST) {
              return {
                description: section.description,
                name: section.name,
                options: (section as ChecklistSection).options.map(
                  (option) => ({
                    checked: option.checked,
                    name: option.name,
                  }),
                ),
                section_identifier: section.section_identifier,
                text: section.text,
                type: section.type,
              }
            } else if (section.type === FORM_TYPES.DIAGRAM) {
              return {
                background: (section as DiagramSection).background,
                description: section.description,
                name: section.name,
                paths: (section as DiagramSection).paths,
                png: (section as DiagramSection).png,
                section_identifier: section.section_identifier,
                svg: (section as DiagramSection).svg,
                text: section.text,
                type: section.type,
              }
            } else if (section.type === FORM_TYPES.SINGLE_SELECTION) {
              return {
                description: section.description,
                name: section.name,
                options: (section as SingleSelectionSection).options.map(
                  (option) => ({
                    checked: option.checked,
                    name: option.name,
                  }),
                ),
                section_identifier: section.section_identifier,
                text: section.text,
                type: section.type,
              }
            } else if (section.type === FORM_TYPES.TEXT) {
              return {
                description: section.description,
                name: section.name,
                section_identifier: section.section_identifier,
                text: section.text,
                type: section.type,
              }
            }
          }),
        },
        form_identifier,
      },
    })
    set_last_saved(new Date())
  }
  useEffect(() => {
    const next_autosave = new Date(last_saved.getTime() + AUTOSAVE_INTERVAL)
    if (new Date() > next_autosave) {
      save_form()
    }
  }, [form, last_saved])

  const change_diagram = (section_identifier: uuid, diagram: uuid) => {
    if (!form) return
    set_form({
      ...form,
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              background: diagram,
            }
          : section,
      ),
    })
  }

  const change_options = (section_identifier: uuid, options: FormOption[]) => {
    if (!form) return
    set_form({
      ...form,
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              options,
            }
          : section,
      ),
    })
  }

  const change_section_description = (
    section_identifier: uuid,
    description: string,
  ) => {
    if (!form) return
    set_form({
      ...form,
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              description,
            }
          : section,
      ),
    })
  }

  const create_new_section = (type: FORM_TYPES) => {
    if (!form) return

    let section
    switch (type) {
      case FORM_TYPES.CHECKLIST:
        section = {
          description: "",
          name: NEW_SECTION_NAMES.CHECKLIST,
          section_identifier: v4(),
          options: [],
          type: FORM_TYPES.CHECKLIST,
        }
        break

      case FORM_TYPES.DIAGRAM:
        section = {
          background: BLANK_CANVAS,
          description: "",
          name: NEW_SECTION_NAMES.DIAGRAM,
          section_identifier: v4(),
          type: FORM_TYPES.DIAGRAM,
        }
        break

      case FORM_TYPES.SINGLE_SELECTION:
        section = {
          description: "",
          name: NEW_SECTION_NAMES.SINGLE_SELECTION,
          options: [],
          section_identifier: v4(),
          type: FORM_TYPES.SINGLE_SELECTION,
        }
        break

      case FORM_TYPES.TEXT:
        section = {
          description: "",
          name: NEW_SECTION_NAMES.TEXT,
          section_identifier: v4(),
          section_type: "text",
          text: "",
          type: FORM_TYPES.TEXT,
        } as TextSection
        break

      default:
        throw new Error("Invalid section type")
    }

    set_form({
      ...form,
      // @ts-ignore
      sections: [...form.sections, section],
    })
  }

  const delete_section = (section_identifier: uuid) => {
    if (!form) return
    set_form({
      ...form,
      sections: form.sections.filter(
        (section) => section.section_identifier !== section_identifier,
      ),
    })
  }

  const on_drag_end = (result: DropResult) => {
    if (!form) return
    const { destination, source } = result
    if (!destination) return
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }
    const sections_to_move = form.sections.splice(source.index, 1)
    if (sections_to_move === undefined || sections_to_move.length === 0) return
    form.sections.splice(destination.index, 0, sections_to_move[0])
    set_form({ ...form, sections: form.sections })
  }

  const rename_form = (name: string) => {
    if (!form) return
    set_form({ ...form, name })
  }

  const rename_patient = (patient_identifier: string) => {
    if (!form) return
    set_form({ ...form, patient_identifier })
  }
  const rename_section = (section_identifier: uuid, name: string) => {
    if (!form) return
    set_form({
      ...form,
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              name,
            }
          : section,
      ),
    })
  }

  const update_checklist_option = (
    section_identifier: uuid,
    option_identifier: uuid,
    checked: boolean,
  ) => {
    if (!form) return
    set_form({
      ...form,
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              options: (section as ChecklistSection).options.map((option) =>
                option.option_identifier === option_identifier
                  ? {
                      ...option,
                      checked,
                    }
                  : option,
              ),
            }
          : section,
      ),
    })
  }

  const update_diagram = (
    section_identifier: uuid,
    paths: any,
    png: any,
    svg: any,
  ) => {
    if (!form) return
    // @ts-ignore
    set_form((form) => ({
      ...form,
      // @ts-ignore
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              paths,
              png,
              svg,
            }
          : section,
      ),
    }))
  }

  const update_single_selection = (
    section_identifier: uuid,
    option_identifier: uuid,
  ) => {
    if (!form) return
    set_form({
      ...form,
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              options: (section as SingleSelectionSection).options.map(
                (option) =>
                  option.option_identifier === option_identifier
                    ? {
                        ...option,
                        checked: !option.checked,
                      }
                    : {
                        ...option,
                        checked: false,
                      },
              ),
            }
          : section,
      ),
    })
  }

  const update_text = (section_identifier: uuid, text: string) => {
    if (!form) return
    // @ts-ignore
    set_form((form) => ({
      ...form,
      // @ts-ignore
      sections: form.sections.map((section) =>
        section.section_identifier === section_identifier
          ? {
              ...section,
              text,
            }
          : section,
      ),
    }))
  }

  if (!form) return <Loader />
  return (
    <div className="page">
      <div className="container">
        <div className="header">
          <div className="form-editor-title-editable">
            Form name
            <div className="editable-title-small">
              <input
                onBlur={(e) => {
                  if (e.target.value === "") rename_form(PLACEHOLDER_FORM_NAME)
                }}
                onChange={(e) => {
                  if (e.target.value !== undefined) rename_form(e.target.value)
                }}
                type="text"
                value={form.name}
              />
            </div>
          </div>
          <div className="form-editor-title-editable">
            Patient identifier
            <div className="editable-title-small">
              <input
                onBlur={(e) => {
                  if (e.target.value === "")
                    rename_patient(PLACEHOLDER_PATIENT_IDENTIFIER)
                }}
                onChange={(e) => {
                  if (e.target.value !== undefined)
                    rename_patient(e.target.value)
                }}
                type="text"
                value={form.patient_identifier}
              />
            </div>
          </div>
          <div
            className="form-editor-options"
            style={{ alignItems: "baseline" }}
          >
            <div className="form-editor-options-left-group">
              <div className="form-editor-instructions">
                Last autosaved:{" "}
                {last_saved &&
                  format(new Date(last_saved), "dd MMM yyyy HH:mm")}
              </div>
            </div>
            <div className="form-editor-options-right-group">
              <div className="large-primary-button">
                <button
                  onClick={() => {
                    save_form().then(() =>
                      navigate(`/view/${form.form_identifier}`),
                    )
                  }}
                  title="Save and next"
                >
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    size="xl"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
        <DragDropContext onDragEnd={on_drag_end}>
          <div className="sections-container">
            <Droppable droppableId={"sections-droppable"}>
              {(provided) => (
                <div
                  className="section-wrapper"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {form.sections.map((section, section_number) => (
                    <Section
                      change_diagram={change_diagram}
                      change_options={change_options}
                      change_section_description={change_section_description}
                      delete_section={delete_section}
                      index={section_number}
                      key={section.section_identifier}
                      rename_section={rename_section}
                      reorder_mode={reorder_mode}
                      section={section}
                      update_checklist_option={update_checklist_option}
                      update_diagram={update_diagram}
                      update_single_selection={update_single_selection}
                      update_text={update_text}
                    />
                  ))}
                  {provided.placeholder}
                  <div className="footer-buttons">
                    <DropdownMenu<HTMLButtonElement>
                      trigger={({
                        isSelected,
                        testId,
                        triggerRef,
                        ...providedProps
                      }) => (
                        <div
                          className={
                            isSelected
                              ? "footer-button-inverted"
                              : "footer-button"
                          }
                        >
                          <button
                            ref={triggerRef}
                            title="Add section"
                            {...providedProps}
                          >
                            <FontAwesomeIcon
                              icon={faPlus}
                              size="xl"
                            />
                          </button>
                        </div>
                      )}
                    >
                      <DropdownItemGroup>
                        <div style={{ color: "#102a43" }}>
                          <DropdownItem
                            onClick={() =>
                              create_new_section(FORM_TYPES.CHECKLIST)
                            }
                          >
                            Checklist
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              create_new_section(FORM_TYPES.DIAGRAM)
                            }
                          >
                            Diagram
                          </DropdownItem>
                          <DropdownItem
                            onClick={() =>
                              create_new_section(FORM_TYPES.SINGLE_SELECTION)
                            }
                          >
                            Single selection
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => create_new_section(FORM_TYPES.TEXT)}
                          >
                            Text
                          </DropdownItem>
                        </div>
                      </DropdownItemGroup>
                    </DropdownMenu>
                    <div
                      className={
                        reorder_mode
                          ? "footer-button-inverted"
                          : "footer-button"
                      }
                    >
                      <button
                        onClick={() => {
                          set_reorder_mode(!reorder_mode)
                        }}
                        title="Reorder sections"
                      >
                        <FontAwesomeIcon
                          icon={faBarsStaggered}
                          size="xl"
                        />
                      </button>
                    </div>
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
