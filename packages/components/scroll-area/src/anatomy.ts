import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('scroll-area').parts(
  'root',
  'viewport',
  'content',
  'scrollbar',
  'thumb',
  'corner',
)

export const parts = anatomy.build()
