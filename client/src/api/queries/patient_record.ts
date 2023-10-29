import { gql } from "@apollo/client"

export const PATIENT_RECORD = gql`
  query patient_record($patient_identifier: String!) {
    patient_record(patient_identifier: $patient_identifier) {
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
