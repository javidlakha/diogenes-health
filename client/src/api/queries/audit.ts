import { gql } from "@apollo/client"

export const AUDIT = gql`
  query audit($form_identifier: ID!) {
    audit(form_identifier: $form_identifier) {
      action
      form_identifier
      timestamp
      user {
        name
        user_identifier
      }
    }
  }
`
