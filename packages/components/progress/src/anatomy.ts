import { createAnatomy } from "@destyler/anatomy"

export const anatomy = createAnatomy("progress").parts(
  "root",
  "label",
  "track",
  "range",
  "valueText",
  "view",
  "circle",
  "circleTrack",
  "circleRange",
)

export const parts = anatomy.build()
