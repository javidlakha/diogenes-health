import { gql } from "@apollo/client"

export const FORMS = gql`
  query forms {
    forms {
      form_identifier
      last_modified
      name
      patient_identifier
    }
  }
`
