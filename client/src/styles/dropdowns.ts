import { Theme } from "react-select"

export function dropdown_theme(theme: Theme) {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary25: "#dee2e6",
      primary50: "#aeb5be",
      primary: "#858c95",
    },
  }
}
