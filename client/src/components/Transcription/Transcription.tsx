import { useState } from "react"
import { useLazyQuery, useMutation } from "@apollo/client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBug,
  faMicrophone,
  faSpinner,
} from "@fortawesome/pro-regular-svg-icons"
import { faStop } from "@fortawesome/pro-solid-svg-icons"
import axios from "axios"
import { useReactMediaRecorder } from "react-media-recorder"

import { UPLOAD_RECORDING } from "api/mutations"
import { TRANSCRIBE } from "api/queries"
import "./transcription.css"

interface Fields {
  [key: string]: string
}

enum TranscriptionStatus {
  ERROR = "error",
  PENDING = "pending",
  RECORDING = "recording",
  TRANSCRIBING = "transcribing",
}

interface TranscriptionProps {
  on_success: (transcription: string) => void
}

export function Transcription({ on_success }: TranscriptionProps) {
  const [transcription_status, set_transcription_status] = useState(
    TranscriptionStatus.PENDING,
  )
  const [transcribe] = useLazyQuery(TRANSCRIBE)
  const [get_recording_upload_url] = useMutation(UPLOAD_RECORDING)

  const upload_recording = async (recording: Blob) => {
    set_transcription_status(TranscriptionStatus.TRANSCRIBING)

    try {
      // Obtain presigned S3 upload URL
      const response = await get_recording_upload_url()
      let { recording_identifier, request_data } =
        response["data"]["upload_recording"]
      request_data = JSON.parse(request_data)

      // Upload recording to S3
      const form_data = new FormData()
      Object.entries(request_data.fields as Fields).forEach(([k, v]) => {
        form_data.append(k, v)
      })
      form_data.append("file", recording)
      await axios.post(request_data.url, form_data, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      // Transcribe audio
      const transcription_response = await transcribe({
        variables: { recording_identifier },
      })

      on_success(transcription_response["data"]["transcribe"])
      clearBlobUrl()
      set_transcription_status(TranscriptionStatus.PENDING)
    } catch (err) {
      set_transcription_status(TranscriptionStatus.ERROR)
      console.error(err)
    }
  }

  const { clearBlobUrl, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      mediaRecorderOptions: { mimeType: "audio/wav" },
      onStart: () => set_transcription_status(TranscriptionStatus.RECORDING),
      onStop: (_, recording) => upload_recording(recording),
      video: false,
    })

  const retry = async () => {
    if (!mediaBlobUrl) return
    const audio_blob = await fetch(mediaBlobUrl).then((r) => r.blob())
    upload_recording(audio_blob)
  }

  if (transcription_status === TranscriptionStatus.ERROR)
    return (
      <div className="transcribe-audio-button">
        <button
          onClick={retry}
          title="Retry transcription"
        >
          <FontAwesomeIcon
            icon={faBug}
            size="xl"
          />
          <div className="button-text">
            An error occurred. Click here to retry transcription
          </div>
        </button>
      </div>
    )

  if (transcription_status === TranscriptionStatus.RECORDING)
    return (
      <div className="transcribe-audio-button">
        <button
          onClick={stopRecording}
          title="Stop recording"
        >
          <FontAwesomeIcon
            icon={faStop}
            size="xl"
          />
          <div className="button-text">Stop recording</div>
        </button>
      </div>
    )

  if (transcription_status === TranscriptionStatus.TRANSCRIBING)
    return (
      <div className="transcription-status">
        <div>
          <FontAwesomeIcon
            icon={faSpinner}
            size="xl"
            spin={true}
          />
        </div>
        <div>Transcribing audio</div>
      </div>
    )

  return (
    <div className="transcribe-audio-button">
      <button
        onClick={startRecording}
        title="Transcribe a voice recording"
      >
        <FontAwesomeIcon
          icon={faMicrophone}
          size="xl"
        />
        <div className="button-text">Transcribe a voice recording</div>
      </button>
    </div>
  )
}
