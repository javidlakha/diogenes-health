import { gql } from "@apollo/client"

export const DELETE_TEMPLATE = gql`
  mutation delete_template($template_identifier: ID!) {
    delete_template(template_identifier: $template_identifier) {
      template_identifier
    }
  }
`
