import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('hoverCard').parts(
  'arrow',
  'arrowTip',
  'trigger',
  'positioner',
  'content',
)
export const parts = anatomy.build()
