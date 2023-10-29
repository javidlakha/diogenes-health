import { Link } from "react-router-dom"
import Select from "react-select"

import { DIAGRAMS } from "assets/diagrams"
import { dropdown_theme } from "styles/dropdowns"
import { TemplateEditorSection, uuid } from "types"

const DIAGRAM_OPTIONS = Object.entries(DIAGRAMS).map(([k, v]) => ({
  label: v.description,
  value: k,
}))

interface DiagramProps {
  change_diagram: (section: number, diagram: uuid) => void
  index: number
  section: TemplateEditorSection
}

export function Diagram({ change_diagram, index, section }: DiagramProps) {
  const diagram = DIAGRAMS[section.background as uuid]

  return (
    <>
      <div className="template-editor-section-setting">
        <div className="template-editor-section-setting-title">Background</div>
        <div className="template-editor-section-setting-description">
          The user will be able to annotate this
        </div>
        <div className="template-editor-section-setting-dropdown">
          <Select
            defaultValue={DIAGRAM_OPTIONS.filter(
              (option) => option.value === section.background,
            )}
            onChange={(e) => {
              if (e?.value !== undefined) change_diagram(index, e.value)
            }}
            options={DIAGRAM_OPTIONS}
            theme={dropdown_theme}
          />
        </div>
        <div>
          {diagram?.display && diagram?.image && (
            <img
              alt={`Diagram: ${section.name}`}
              height={150}
              src={`data:image/svg+xml;utf8,${encodeURIComponent(
                DIAGRAMS[section.background as uuid].image,
              )}`}
              width={150}
            />
          )}
        </div>
      </div>
      {!diagram.available && (
        <div className="template-editor-not-available">
          Coming soon!{" "}
          <button
            onClick={() =>
              alert(
                "Thank you for registering your interest. We will be in touch when this diagram is available!",
              )
            }
          >
            Notify me
          </button>
          .
        </div>
      )}
    </>
  )
}
