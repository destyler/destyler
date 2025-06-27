import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('collapse').parts('root', 'item', 'itemTrigger', 'itemContent', 'itemIndicator')
export const parts = anatomy.build()
