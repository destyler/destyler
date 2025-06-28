import { createAnatomy } from "@destyler/anatomy"

export const anatomy = createAnatomy("popover").parts(
  "arrow",
  "arrowTip",
  "anchor",
  "trigger",
  "indicator",
  "positioner",
  "content",
  "title",
  "description",
  "closeTrigger",
)

export const parts = anatomy.build()
