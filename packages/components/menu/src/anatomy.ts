import { createAnatomy } from "@destyler/anatomy"

export const anatomy = createAnatomy("menu").parts(
  "arrow",
  "arrowTip",
  "content",
  "contextTrigger",
  "indicator",
  "item",
  "itemGroup",
  "itemGroupLabel",
  "itemIndicator",
  "itemText",
  "positioner",
  "separator",
  "trigger",
  "triggerItem",
)
export const parts = anatomy.build()
