import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('collapsible').parts('root', 'trigger', 'content')

export const parts = anatomy.build()
