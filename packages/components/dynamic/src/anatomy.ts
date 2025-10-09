import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('dynamic').parts(
  'root',
  'label',
  'control',
  'input',
  'clearTrigger',
  'item',
  'itemPreview',
  'itemInput',
  'itemText',
  'itemDeleteTrigger',
)

export const parts = anatomy.build()
