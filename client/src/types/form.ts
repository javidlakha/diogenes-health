import { CanvasPath } from "react-sketch-canvas"
import { uuid } from "./index"

export interface FormOption {
  checked?: boolean
  name: string
  option_identifier: uuid
}

interface BaseSection {
  description: string
  name: string
  section_identifier: uuid
  text?: string
  type: string
}

export interface ChecklistSection extends BaseSection {
  checked: uuid[]
  options: FormOption[]
  other_options: string[] // TODO: delete
}

export interface DiagramSection extends BaseSection {
  background: uuid
  paths: CanvasPath[]
  png: string
  svg: string
}

export interface TextSection extends BaseSection {
  text: string
}

export interface SingleSelectionSection extends BaseSection {
  options: FormOption[]
  other_option: string // TODO: delete
  selected: uuid
}

export type FormSection =
  | ChecklistSection
  | DiagramSection
  | SingleSelectionSection
  | TextSection

export interface Form {
  form_identifier: uuid
  last_modified: string
  name: string
  patient_identifier: string
  sections: FormSection[]
}

export interface FormMetadata {
  form_identifier: uuid
  last_modified: string
  name: string
  patient_identifier: string
}
