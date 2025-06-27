import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('breadcrumbs').parts('root', 'list', 'item', 'link', 'separator')

export const parts = anatomy.build()
