import { FORM_TYPES } from "constants/form"

export const CREATE_NEW_TEMPLATE = "create"

export const DEFAULT_SECTION_NAME = "New section"

export const PLACEHOLDER_TEMPLATE_NAME = "New Template"

export const SECTION_TYPE_NAMES = {
  [FORM_TYPES.CHECKLIST]: "Checklist",
  [FORM_TYPES.DIAGRAM]: "Diagram",
  [FORM_TYPES.FILES]: "Images and files",
  [FORM_TYPES.SIGNATURE_BLOCK]: "Signature block",
  [FORM_TYPES.SINGLE_SELECTION]: "Single selection",
  [FORM_TYPES.TABLE]: "Table",
  [FORM_TYPES.TEXT]: "Text",
}

export enum TemplateType {
  PUBLIC = "public",
  USER = "user",
}
