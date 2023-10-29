import { gql } from "@apollo/client"

export const TEMPLATES = gql`
  query templates {
    templates {
      name
      template_identifier
      type
    }
  }
`
