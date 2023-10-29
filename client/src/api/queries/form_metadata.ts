import { gql } from "@apollo/client"

export const FORM_METADATA = gql`
  query form_metadata($form_identifier: ID!) {
    form(form_identifier: $form_identifier) {
      form_identifier
      last_modified
      name
      patient_identifier
    }
  }
`
