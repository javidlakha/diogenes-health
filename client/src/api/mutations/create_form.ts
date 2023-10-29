import { gql } from "@apollo/client"

export const CREATE_FORM = gql`
  mutation create_form(
    $template_identifier: ID!
    $patient_identifier: String!
  ) {
    create_form(
      template_identifier: $template_identifier
      patient_identifier: $patient_identifier
    ) {
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
