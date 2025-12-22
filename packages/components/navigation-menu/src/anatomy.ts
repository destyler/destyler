import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('navigation-menu').parts(
  'root',
  'viewportPositioner',
  'viewport',
  'trigger',
  'content',
  'list',
  'item',
  'link',
  'indicator',
  'itemIndicator',
  'arrow',
)

export const parts = anatomy.build()
