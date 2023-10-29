export const AUTOSAVE_INTERVAL = 60 * 1000 // milliseconds
export const DEFAULT_FORM_NAME = "Demo Patient"

export enum FORM_TYPES {
  CHECKLIST = "checklist",
  DIAGRAM = "diagram",
  FILES = "files",
  SIGNATURE_BLOCK = "signature_block",
  SINGLE_SELECTION = "single_selection",
  TABLE = "table",
  TEXT = "text",
}

// Placeholders for when new sections are created
export enum NEW_SECTION_NAMES {
  CHECKLIST = "New checklist",
  DIAGRAM = "New diagram",
  FILES = "New images and files",
  SIGNATURE_BLOCK = "New signature block",
  SINGLE_SELECTION = "New single selection",
  TABLE = "New table",
  TEXT = "New textbox",
}

export const NO_OBSERVATIONS = "No observations recorded"
export const PLACEHOLDER_FORM_NAME = "Untitled form"
export const PLACEHOLDER_PATIENT_IDENTIFIER = "Patient 0"

// Placeholder for when the user deletes the name of a section
export const PLACEHOLDER_SECTION_NAME = "Untitled section"
