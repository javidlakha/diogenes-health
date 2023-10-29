import { gql } from "@apollo/client"

export const TEMPLATE = gql`
  query template($template_identifier: ID!) {
    template(template_identifier: $template_identifier) {
      name
      type
      sections {
        background
        description
        name
        options {
          name
        }
        type
      }
    }
  }
`
