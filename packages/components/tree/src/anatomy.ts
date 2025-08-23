import { createAnatomy } from '@destyler/anatomy'

export const anatomy = createAnatomy('tree-view').parts(
  'root',
  'label',
  'tree',
  'item',
  'itemIndicator',
  'itemText',
  'branch',
  'branchControl',
  'branchTrigger',
  'branchContent',
  'branchText',
  'branchIndicator',
  'branchIndentGuide',
)

export const parts = anatomy.build()
