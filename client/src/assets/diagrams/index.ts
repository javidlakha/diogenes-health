import blank_canvas from "./blank_canvas"
import diagram_8ed6221c51864e929339ebf4314cba33 from "./8ed6221c-5186-4e92-9339-ebf4314cba33"

import { Diagrams } from "../../types"

export const BLANK_CANVAS = "BLANK_CANVAS"

export const DIAGRAMS = {
  [BLANK_CANVAS]: {
    available: true,
    description: "Blank canvas",
    display: false,
    image: blank_canvas,
  },
  "8ed6221c-5186-4e92-9339-ebf4314cba33": {
    available: true,
    description: "Lungs",
    display: true,
    image: diagram_8ed6221c51864e929339ebf4314cba33,
  },
} as Diagrams
