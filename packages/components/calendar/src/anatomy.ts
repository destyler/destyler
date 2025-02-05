import { createAnatomy } from '@zag-js/anatomy'

export const anatomy = createAnatomy('calendar').parts(
  'root',
  'label',
  'clearTrigger',
  'content',
  'control',
  'input',
  'monthSelect',
  'nextTrigger',
  'positioner',
  'prevTrigger',
  'rangeText',
  'table',
  'tableBody',
  'tableCell',
  'tableCellTrigger',
  'tableHead',
  'tableHeader',
  'tableRow',
  'trigger',
  'viewTrigger',
  'viewControl',
  'yearSelect',
  'presetTrigger',
)

export const parts = anatomy.build()
