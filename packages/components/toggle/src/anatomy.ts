import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('toggle').parts('root', 'item')

export const parts = anatomy.build()
