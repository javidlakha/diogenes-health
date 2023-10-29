import { v4 } from "uuid"

import { FORM_TYPES } from "constants/form"
import { DEFAULT_SECTION_NAME } from "constants/template"
import { Template, TemplateEditorTemplate, TemplateEditorSection } from "types"
import { BLANK_CANVAS } from "assets/diagrams"

export function create_empty_section(): TemplateEditorSection {
  return {
    background: BLANK_CANVAS,
    description: "",
    name: DEFAULT_SECTION_NAME,
    options: [],
    section_identifier: v4(),
    type: FORM_TYPES.TEXT,
  }
}

export function preprocess_template(
  template: Template,
): TemplateEditorTemplate {
  return {
    ...template,
    sections: template.sections.map((section) => ({
      background: "background" in section ? section.background : "",
      description: section.description,
      name: section.name,
      options: "options" in section ? section.options : [],
      section_identifier: v4(),
      type: section.type,
    })),
  }
}
