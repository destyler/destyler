import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('edit').parts(
  'root',
  'area',
  'label',
  'preview',
  'input',
  'editTrigger',
  'submitTrigger',
  'cancelTrigger',
  'control',
)

export const parts = anatomy.build()
