import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('splitter').parts('root', 'panel', 'resizeTrigger')

export const parts = anatomy.build()
