import { gql } from "@apollo/client"

export const DELETE_FORM = gql`
  mutation delete_form($form_identifier: ID!) {
    delete_form(form_identifier: $form_identifier) {
      form_identifier
    }
  }
`
