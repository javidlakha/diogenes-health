import { FORM_TYPES } from "constants/form"
import {
  ChecklistSection,
  DiagramSection,
  FormSection,
  SingleSelectionSection,
  TextSection,
} from "types"
import { Checklist } from "./Checklist"
import { Diagram } from "./Diagram"
import { SingleSelection } from "./SingleSelection"
import { Text } from "./Text"

interface SectionProps {
  section: FormSection
}

export function Section({ section }: SectionProps) {
  return (
    <div className="form-viewer-section">
      <div className="form-viewer-section-title">{section.name}</div>
      {section.type === FORM_TYPES.CHECKLIST && (
        <Checklist
          options={(section as ChecklistSection).options}
          notes={section.text}
        />
      )}
      {section.type === FORM_TYPES.DIAGRAM && (
        <Diagram
          name={section.name}
          notes={section.text}
          paths={(section as DiagramSection).paths}
          svg={(section as DiagramSection).svg}
        />
      )}
      {section.type === FORM_TYPES.SINGLE_SELECTION && (
        <SingleSelection
          options={(section as SingleSelectionSection).options}
          notes={section.text}
        />
      )}
      {section.type === FORM_TYPES.TEXT && (
        <Text text={(section as TextSection).text} />
      )}
    </div>
  )
}
