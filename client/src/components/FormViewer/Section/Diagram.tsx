import { CanvasPath } from "react-sketch-canvas"

import { NO_OBSERVATIONS } from "constants/form"
import { svg } from "types"

interface DiagramProps {
  name: string
  notes?: string
  paths: CanvasPath[]
  svg?: svg
}

export function Diagram({ name, notes, paths, svg }: DiagramProps) {
  const display_diagram = paths.length > 0 && svg

  return (
    <>
      <div className="form-viewer-diagram">
        {display_diagram && (
          <img
            alt={`Diagram: ${name}`}
            height={150}
            src={svg}
            width={150}
          />
        )}
      </div>
      {notes?.trim() && <div className="form-viewer-text">{notes}</div>}
      {!display_diagram && !notes?.trim() && (
        <div className="form-viewer-text">{NO_OBSERVATIONS}</div>
      )}
    </>
  )
}
