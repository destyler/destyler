import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('label').parts('root')

export const parts = anatomy.build()
