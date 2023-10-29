import { gql } from "@apollo/client"

export const TRANSCRIBE = gql`
  query transcribe($recording_identifier: ID!) {
    transcribe(recording_identifier: $recording_identifier)
  }
`
