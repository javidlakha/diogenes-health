import { gql } from "@apollo/client"

export const FORM = gql`
  query form($form_identifier: ID!) {
    form(form_identifier: $form_identifier) {
      form_identifier
      last_modified
      name
      patient_identifier
      sections {
        background
        description
        name
        options {
          checked
          name
        }
        paths {
          drawMode
          strokeColor
          strokeWidth
          paths {
            x
            y
          }
        }
        section_identifier
        svg
        text
        type
      }
    }
  }
`
