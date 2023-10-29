import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faEraser,
  faRotateLeft,
  faPen,
  faRotateRight,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons"
import Select from "react-select"
import {
  CanvasPath,
  ReactSketchCanvas,
  ReactSketchCanvasRef,
} from "react-sketch-canvas"

import { BLANK_CANVAS, DIAGRAMS } from "assets/diagrams"
import { Notes } from "components/FormEditor/Notes/Notes"
import { dropdown_theme } from "styles/dropdowns"
import { uuid } from "types"

const DIAGRAM_OPTIONS = Object.entries(DIAGRAMS).map(([k, v]) => ({
  label: v.description,
  value: k,
}))

const canvas_style = {
  aspectRatio: "1 / 1",
  border: "0.0625rem solid #aeb5be",
  borderRadius: "0.25rem",
  cursor: "crosshair",
  width: "100%",
}

interface DiagramProps {
  background: uuid
  change_diagram: (section_identifier: uuid, diagram: uuid) => void
  edit_mode: boolean
  paths: CanvasPath[]
  section_identifier: uuid
  text: string
  update_diagram: (
    section_identifier: uuid,
    paths: CanvasPath[],
    image: string,
    svg: string,
  ) => void
  update_text: (section_identifier: uuid, text: string) => void
}

export function Diagram({
  background,
  change_diagram,
  edit_mode,
  paths,
  section_identifier,
  text,
  update_diagram,
  update_text,
}: DiagramProps) {
  const canvas = useRef<ReactSketchCanvasRef>(null)
  const canvas_background = DIAGRAMS[background]?.image || ""
  const [erase_mode, set_erase_mode] = useState(false)

  const existing_paths = paths
  useEffect(() => {
    if (
      canvas.current !== null &&
      existing_paths !== undefined &&
      existing_paths.length > 0
    ) {
      canvas.current.loadPaths(existing_paths)
    }
    // Prevent infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, edit_mode])

  const on_change = async () => {
    if (!(await canvas.current?.exportPaths())) {
    }

    update_diagram(
      section_identifier,
      (await canvas.current?.exportPaths()) || [],
      (await canvas.current?.exportImage("png")) || "",
      (await canvas.current?.exportSvg()) || "",
    )
  }

  if (edit_mode)
    return (
      <div className="form-editor-setting">
        <div className="form-editor-setting-title">Background</div>
        <div className="form-editor-setting-description">
          The user will be able to annotate this
        </div>
        <div className="template-editor-section-setting-dropdown">
          <Select
            defaultValue={DIAGRAM_OPTIONS.filter(
              (option) => option.value === background,
            )}
            onChange={(e) => {
              if (e?.value !== undefined)
                change_diagram(section_identifier, e.value)
            }}
            options={DIAGRAM_OPTIONS}
            theme={dropdown_theme}
          />
        </div>
        <div>
          {background !== BLANK_CANVAS && DIAGRAMS[background as uuid]?.image && (
            <img
              //alt={`Diagram: ${section.name}`}
              height={150}
              src={`data:image/svg+xml;utf8,${encodeURIComponent(
                DIAGRAMS[background as uuid].image,
              )}`}
              width={150}
            />
          )}
        </div>
      </div>
    )

  return (
    <div className="form-editor-content">
      <div className="form-editor-instructions">
        Use the controls below to annotate the diagram
      </div>
      <div className="form-editor-diagram-options">
        <div className="form-editor-diagram-options-left">
          <div className={erase_mode ? "" : "active-button"}>
            <button
              disabled={!erase_mode}
              onClick={() => {
                canvas.current?.eraseMode(false)
                set_erase_mode(false)
              }}
              type="button"
            >
              <FontAwesomeIcon
                icon={faPen}
                size="lg"
                title="Draw"
              />
            </button>
          </div>
          <div className={erase_mode ? "active-button" : ""}>
            <button
              disabled={erase_mode}
              onClick={() => {
                canvas.current?.eraseMode(true)
                set_erase_mode(true)
              }}
              type="button"
            >
              <FontAwesomeIcon
                icon={faEraser}
                size="lg"
                title="Erase"
              />
            </button>
          </div>
        </div>
        <div className="form-editor-diagram-options-right">
          <button
            onClick={() => {
              canvas.current?.undo()
            }}
            type="button"
          >
            <FontAwesomeIcon
              icon={faRotateLeft}
              size="lg"
              title="Undo"
            />
          </button>
          <button
            onClick={() => {
              canvas.current?.redo()
            }}
            type="button"
          >
            <FontAwesomeIcon
              icon={faRotateRight}
              size="lg"
              title="Redo"
            />
          </button>
          <button
            onClick={() => {
              canvas.current?.clearCanvas()
            }}
            type="button"
          >
            <FontAwesomeIcon
              icon={faTrashCan}
              size="lg"
              title="Reset"
            />
          </button>
        </div>
      </div>
      <div className="form-editor-diagram-canvas">
        <ReactSketchCanvas
          backgroundImage={`data:image/svg+xml;utf8,${encodeURIComponent(
            canvas_background,
          )}`}
          eraserWidth={32}
          exportWithBackgroundImage={true}
          id={section_identifier}
          onChange={on_change}
          ref={canvas}
          strokeColor="black"
          strokeWidth={4}
          style={canvas_style}
        />
      </div>
      <Notes
        text={text}
        section_identifier={section_identifier}
        update_text={update_text}
      />
    </div>
  )
}
