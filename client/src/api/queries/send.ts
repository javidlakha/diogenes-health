import { gql } from "@apollo/client"

export const SEND = gql`
  query send($form_identifier: ID!, $format: DocumentFormat!, $to: String!) {
    send(form_identifier: $form_identifier, format: $format, to: $to)
  }
`
