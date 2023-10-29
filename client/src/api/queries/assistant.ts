import { gql } from "@apollo/client"

export const ASSISTANT = gql`
  query assistant($form_identifier: ID!, $messages: [AssistantMessageInput]!) {
    assistant(form_identifier: $form_identifier, messages: $messages) {
      content
      role
    }
  }
`
