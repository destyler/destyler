import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('pagination').parts('root', 'item', 'ellipsis', 'prevTrigger', 'nextTrigger')

export const parts = anatomy.build()
