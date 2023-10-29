export type { AuditRecord } from "./audit"

export type { CognitoTokens, UserData } from "./cognito"

export type {
  ChecklistSection,
  DiagramSection,
  Form,
  FormMetadata,
  FormOption,
  FormSection,
  SingleSelectionSection,
  TextSection,
} from "./form"

export type {
  Template,
  TemplateEditorSection,
  TemplateEditorTemplate,
  TemplateChecklistSection,
  TemplateDiagramSection,
  TemplateMetadata,
  TemplateOption,
  TemplateSection,
  TemplateSingleSelectionSection,
  TemplateTextSection,
} from "./template"

export interface Diagrams {
  [identifier: uuid]: {
    available: boolean
    description: string
    display: boolean
    image: string
  }
}

export type svg = string

export type uuid = string
