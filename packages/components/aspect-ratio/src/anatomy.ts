import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('aspect-ratio').parts('root', 'content')

export const parts = anatomy.build()
