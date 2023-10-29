import { gql } from "@apollo/client"

export const UPDATE_FORM = gql`
  mutation update_form($form: FormInput!, $form_identifier: ID!) {
    update_form(form: $form, form_identifier: $form_identifier) {
      form_identifier
    }
  }
`
