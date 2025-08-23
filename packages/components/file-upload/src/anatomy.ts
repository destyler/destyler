import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('file-upload').parts(
  'root',
  'dropzone',
  'item',
  'itemDeleteTrigger',
  'itemGroup',
  'itemName',
  'itemPreview',
  'itemPreviewImage',
  'itemSizeText',
  'label',
  'trigger',
  'clearTrigger',
)

export const parts = anatomy.build()
