import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('image').parts('root', 'image', 'fallback')

export const parts = anatomy.build()
