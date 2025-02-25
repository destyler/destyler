import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('number-input').parts(
  'root',
  'label',
  'input',
  'control',
  'valueText',
  'incrementTrigger',
  'decrementTrigger',
  'scrubber',
)

export const parts = anatomy.build()
