import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEllipsisVertical,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons"
import { Draggable } from "react-beautiful-dnd"
import { Link } from "react-router-dom"
import Select from "react-select"
import TextareaAutosize from "react-textarea-autosize"

import { FORM_TYPES } from "constants/form"
import { DEFAULT_SECTION_NAME, SECTION_TYPE_NAMES } from "constants/template"
import { TemplateEditorSection, TemplateOption, uuid } from "types"
import { dropdown_theme } from "styles/dropdowns"
import { Checklist } from "./Checklist"
import { Diagram } from "./Diagram"
import { SingleSelection } from "./SingleSelection"

const SECTION_TYPE_OPTIONS = Object.values(FORM_TYPES).map((value) => ({
  label: SECTION_TYPE_NAMES[value],
  value: value,
}))

interface SectionProps {
  change_diagram: (section: number, diagram: uuid) => void
  change_options: (section: number, options: TemplateOption[]) => void
  change_section_description: (
    section_number: number,
    description: string,
  ) => void
  change_section_type: (section_number: number, type: string) => void
  delete_section: (section_number: number) => void
  index: number
  rename_section: (section_number: number, name: string) => void
  section: TemplateEditorSection
}

export function Section({
  change_diagram,
  change_options,
  change_section_description,
  change_section_type,
  delete_section,
  index,
  rename_section,
  section,
}: SectionProps) {
  return (
    <Draggable
      draggableId={section.section_identifier}
      index={index}
    >
      {(provided) => (
        <div
          className="template-editor-section-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="template-editor-section-drag-handle"
            {...provided.dragHandleProps}
          >
            <FontAwesomeIcon
              color="grey"
              icon={faEllipsisVertical}
              size="1x"
              width="25px"
            />
          </div>
          <div className="template-editor-section">
            <div className="template-editor-section-name">
              <input
                onBlur={(e) => {
                  if (e.target.value === "")
                    rename_section(index, DEFAULT_SECTION_NAME)
                }}
                onChange={(e) => {
                  if (e.target.value !== undefined)
                    rename_section(index, e.target.value)
                }}
                type="text"
                value={section.name}
              />
            </div>
            <div className="template-editor-section-setting">
              <div className="template-editor-section-setting-flexbox">
                <div className="template-editor-section-type">
                  <div className="template-editor-section-setting-dropdown">
                    <Select
                      defaultValue={SECTION_TYPE_OPTIONS.filter(
                        (option) => option.value === section.type,
                      )}
                      onChange={(e) => {
                        if (e?.value !== undefined)
                          change_section_type(index, e.value)
                      }}
                      options={SECTION_TYPE_OPTIONS}
                      theme={dropdown_theme}
                    />
                  </div>
                </div>
                <div className="template-editor-section-setting-flexbox-right">
                  <button
                    onClick={() => delete_section(index)}
                    title="Delete section"
                  >
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size="xl"
                    />
                  </button>
                </div>
              </div>
            </div>
            {section.type === FORM_TYPES.CHECKLIST && (
              <Checklist
                change_options={change_options}
                index={index}
                section={section}
              />
            )}
            {section.type === FORM_TYPES.DIAGRAM && (
              <Diagram
                change_diagram={change_diagram}
                index={index}
                section={section}
              />
            )}
            {section.type === FORM_TYPES.SINGLE_SELECTION && (
              <SingleSelection
                change_options={change_options}
                index={index}
                section={section}
              />
            )}
            {section.type === FORM_TYPES.TABLE && (
              <div className="template-editor-not-available">
                Coming soon!{" "}
                <button
                  onClick={() =>
                    alert(
                      "Thank you for registering your interest. We will be in touch when this feature is available!",
                    )
                  }
                >
                  Notify me
                </button>
                .
              </div>
            )}
            {section.type !== FORM_TYPES.FILES &&
              section.type !== FORM_TYPES.TABLE &&
              section.type !== FORM_TYPES.SIGNATURE_BLOCK && (
                <div className="template-editor-section-setting">
                  <div className="template-editor-section-setting-title">
                    Description
                  </div>
                  <div className="template-editor-section-setting-description">
                    Use this box to provide instructions to the user
                  </div>
                  <div>
                    <TextareaAutosize
                      minRows={3}
                      onChange={(e) => {
                        change_section_description(index, e.target.value)
                      }}
                      value={section.description}
                    />
                  </div>
                </div>
              )}
          </div>
        </div>
      )}
    </Draggable>
  )
}
