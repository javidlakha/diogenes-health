import { gql } from "@apollo/client"

export const UPLOAD_RECORDING = gql`
  mutation upload_recording {
    upload_recording {
      recording_identifier
      request_data
    }
  }
`
