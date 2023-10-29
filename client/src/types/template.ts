import { uuid } from "./index"

export interface TemplateOption {
  name: string
}

interface BaseTemplateSection {
  description: string
  name: string
  type: string
}

export interface TemplateChecklistSection extends BaseTemplateSection {
  options: TemplateOption[]
}

export interface TemplateDiagramSection extends BaseTemplateSection {
  background: uuid
}

export interface TemplateSingleSelectionSection extends BaseTemplateSection {
  options: TemplateOption[]
}

export interface TemplateTextSection extends BaseTemplateSection {}

export type TemplateSection =
  | TemplateChecklistSection
  | TemplateDiagramSection
  | TemplateSingleSelectionSection
  | TemplateTextSection

export interface Template {
  name: string
  sections: TemplateSection[]
  template_identifier: string
  type: string
}

export interface TemplateEditorSection {
  background: uuid
  description: string
  name: string
  section_identifier: uuid
  type: string
  options: TemplateOption[]
}

export interface TemplateEditorTemplate {
  name: string
  sections: TemplateEditorSection[]
}

export interface TemplateMetadata {
  name: string
  template_identifier: string
  type: string
}
