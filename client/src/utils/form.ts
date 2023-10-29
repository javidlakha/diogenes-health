import { v4 } from "uuid"

import { ChecklistSection, Form, SingleSelectionSection } from "types"

export function preprocess_form(form: Form): Form {
  let preprocessed_form = JSON.parse(
    JSON.stringify(form, (k, v) => (k === "__typename" ? undefined : v)),
  )

  for (let section of preprocessed_form.sections) {
    section.section_identifier = v4()

    if (section.type === "checklist") {
      section.options = (section as ChecklistSection).options.map((option) => ({
        ...option,
        option_identifier: v4(),
      }))
    } else if (section.type === "single_selection") {
      section.options = (section as SingleSelectionSection).options.map(
        (option) => ({
          ...option,
          option_identifier: v4(),
        }),
      )
    }
  }

  return preprocessed_form
}
