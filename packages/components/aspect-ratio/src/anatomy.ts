import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('aspect-ratio').parts('root', 'content')

export const parts = anatomy.build()
