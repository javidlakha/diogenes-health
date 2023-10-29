import React from "react"
import BarLoader from "react-spinners/BarLoader"

interface LoaderProps {
  loading?: boolean
}

export function Loader({ loading }: LoaderProps) {
  return (
    <BarLoader
      color="#102a43"
      loading={loading}
      width="100%"
    />
  )
}
