import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('checkbox').parts(
  'root',
  'label',
  'control',
  'indicator',
)
export const parts = anatomy.build()
