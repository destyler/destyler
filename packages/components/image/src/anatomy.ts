import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('image').parts('root', 'image', 'fallback')

export const parts = anatomy.build()
