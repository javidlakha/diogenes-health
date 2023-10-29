import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEllipsisVertical,
  faGear,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons"
import { Draggable } from "react-beautiful-dnd"
import { CanvasPath } from "react-sketch-canvas"
import TextareaAutosize from "react-textarea-autosize"

import {
  FORM_TYPES,
  NEW_SECTION_NAMES,
  PLACEHOLDER_SECTION_NAME,
} from "constants/form"
import {
  ChecklistSection,
  DiagramSection,
  FormOption,
  FormSection,
  SingleSelectionSection,
  uuid,
} from "types"
import { Checklist } from "./Checklist"
import { Diagram } from "./Diagram"
import { SingleSelection } from "./SingleSelection"
import { Text } from "./Text"

interface SectionProps {
  change_diagram: (section_identifier: uuid, diagram: uuid) => void
  change_options: (section_identifier: uuid, options: FormOption[]) => void
  change_section_description: (
    section_identifier: uuid,
    description: string,
  ) => void
  delete_section: (section_identifier: uuid) => void
  index: number
  rename_section: (section_identifier: uuid, name: string) => void
  reorder_mode: boolean
  section: FormSection
  update_diagram: (
    section_identifier: uuid,
    paths: CanvasPath[],
    image: string,
    svg: string,
  ) => void
  update_checklist_option: (
    section_identifier: uuid,
    option_identifier: uuid,
    checked: boolean,
  ) => void
  update_single_selection: (
    section_identifier: uuid,
    option_identifier: uuid,
  ) => void
  update_text: (section_identifier: uuid, text: string) => void
}

export function Section({
  change_diagram,
  change_options,
  change_section_description,
  delete_section,
  index,
  rename_section,
  reorder_mode,
  section,
  update_checklist_option,
  update_diagram,
  update_single_selection,
  update_text,
}: SectionProps) {
  // Edit mode defaults to false, unless the section name is of the form "New {type}"
  const [edit_mode, set_edit_mode] = useState(
    (Object.values(NEW_SECTION_NAMES) as string[]).includes(section.name),
  )

  return (
    <Draggable
      draggableId={section.section_identifier}
      key={section.section_identifier}
      index={index}
      isDragDisabled={!reorder_mode}
    >
      {(provided) => (
        <div
          className="section-container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="section-drag-handle"
            {...provided.dragHandleProps}
          >
            {reorder_mode && (
              <FontAwesomeIcon
                color="grey"
                icon={faEllipsisVertical}
                size="1x"
                width="25px"
              />
            )}
          </div>
          <div className="section">
            {edit_mode ? (
              <div className="form-editor-section-settings">
                <div className="editable-title-small">
                  <input
                    onBlur={(e) => {
                      if (e.target.value === "")
                        rename_section(
                          section.section_identifier,
                          PLACEHOLDER_SECTION_NAME,
                        )
                    }}
                    onChange={(e) => {
                      if (e.target.value !== undefined)
                        rename_section(
                          section.section_identifier,
                          e.target.value,
                        )
                    }}
                    type="text"
                    value={section.name}
                  />
                </div>
                <div className="options-buttons">
                  <div className="small-secondary-button">
                    <button
                      onClick={() => delete_section(section.section_identifier)}
                      title="Delete section"
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        size="xl"
                      />
                    </button>
                  </div>
                  <div className="small-primary-button">
                    <button
                      onClick={() => set_edit_mode(false)}
                      title="Settings"
                    >
                      <FontAwesomeIcon
                        icon={faGear}
                        size="xl"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="form-editor-section-heading">
                <div className="form-editor-section-name">{section.name}</div>
                <div className="small-secondary-button">
                  <button
                    onClick={() => set_edit_mode(true)}
                    title="Settings"
                  >
                    <FontAwesomeIcon
                      icon={faGear}
                      size="xl"
                    />
                  </button>
                </div>
              </div>
            )}
            {!edit_mode && (
              <div className="form-editor-section-description">
                {
                  // Preserve newlines
                  section.description.trim().length > 0 &&
                    section.description
                      .trim()
                      .split("\n")
                      .map((line, line_number) => (
                        <div
                          className="form-editor-section-description-line"
                          key={line_number}
                        >
                          {line}
                        </div>
                      ))
                }
              </div>
            )}
            {section.type === FORM_TYPES.CHECKLIST && (
              <Checklist
                change_options={change_options}
                edit_mode={edit_mode}
                options={(section as ChecklistSection).options}
                section_identifier={section.section_identifier}
                text={section.text || ""}
                update_checklist_option={update_checklist_option}
                update_text={update_text}
              />
            )}
            {section.type === FORM_TYPES.DIAGRAM && (
              <Diagram
                background={(section as DiagramSection).background}
                change_diagram={change_diagram}
                edit_mode={edit_mode}
                paths={(section as DiagramSection).paths}
                section_identifier={section.section_identifier}
                text={section.text || ""}
                update_diagram={update_diagram}
                update_text={update_text}
              />
            )}
            {section.type === FORM_TYPES.SINGLE_SELECTION && (
              <SingleSelection
                change_options={change_options}
                edit_mode={edit_mode}
                options={(section as SingleSelectionSection).options}
                section_identifier={section.section_identifier}
                text={section.text || ""}
                update_single_selection={update_single_selection}
                update_text={update_text}
              />
            )}
            {!edit_mode && section.type === FORM_TYPES.TEXT && (
              <Text
                section_identifier={section.section_identifier}
                text={section.text || ""}
                update_text={update_text}
              />
            )}
            {edit_mode && (
              <div className="form-editor-setting">
                <div className="form-editor-setting-title">Description</div>
                <div className="form-editor-setting-description">
                  Use this box to provide instructions to the user
                </div>
                <div>
                  <TextareaAutosize
                    minRows={3}
                    onChange={(e) => {
                      change_section_description(
                        section.section_identifier,
                        e.target.value,
                      )
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
