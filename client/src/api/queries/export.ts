import { gql } from "@apollo/client"

export const EXPORT = gql`
  query export($form_identifier: ID!, $format: DocumentFormat!) {
    export(form_identifier: $form_identifier, format: $format)
  }
`
