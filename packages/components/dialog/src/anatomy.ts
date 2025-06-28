import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('dialog').parts(
  'trigger',
  'backdrop',
  'positioner',
  'content',
  'title',
  'description',
  'closeTrigger',
)

export const parts = anatomy.build()
