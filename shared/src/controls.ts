import { defineControls } from './define-controls'

export const aspectRatioControls = defineControls({
  ratio: { type: 'number', defaultValue: 16 / 9 },
})

export const carouselControls = defineControls({
  orientation: { type: 'select', options: ['horizontal', 'vertical'] as const, defaultValue: 'horizontal' },
  slidesPerPage: { type: 'number', defaultValue: 1 },
  loop: { type: 'boolean', defaultValue: false },
})

export const checkboxControls = defineControls({
  name: { type: 'string', defaultValue: 'checkbox' },
  disabled: { type: 'boolean', defaultValue: false },
  value: { type: 'string', defaultValue: 'on' },
  readOnly: { type: 'boolean', defaultValue: false },
})

export const clipboardControls = defineControls({
  timeout: { type: 'number', defaultValue: 3000 },
})

export const collapseControls = defineControls({
  collapsible: { type: 'boolean', defaultValue: true },
  multiple: { type: 'boolean', defaultValue: false },
  orientation: { type: 'select', options: ['horizontal', 'vertical'] as const, defaultValue: 'vertical' },
})

export const collapsibleControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
})

export const colorPickerControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  readOnly: { type: 'boolean', defaultValue: false },
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
})

export const comboboxControls = defineControls({
  inputBehavior: {
    type: 'select',
    defaultValue: 'autohighlight',
    options: ['autohighlight', 'autocomplete', 'none'] as const,
  },
  selectionBehavior: {
    type: 'select',
    defaultValue: 'replace',
    options: ['replace', 'clear', 'preserve'] as const,
  },
  disabled: { type: 'boolean', defaultValue: false },
  multiple: { type: 'boolean', defaultValue: false },
  loopFocus: { type: 'boolean', defaultValue: true },
  openOnClick: { type: 'boolean', defaultValue: false },
})

export const dialogControls = defineControls({
  preventScroll: { type: 'boolean', defaultValue: true },
  closeOnEscape: { type: 'boolean', defaultValue: true },
  closeOnInteractOutside: { type: 'boolean', defaultValue: false },
  role: {
    type: 'select',
    defaultValue: 'dialog',
    options: ['dialog', 'alertdialog'] as const,
  },
})

export const dynamicControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  readOnly: { type: 'boolean', defaultValue: false },
  addOnPaste: { type: 'boolean', defaultValue: false },
  blurBehavior: { type: 'select', options: ['add', 'clear'] as const, defaultValue: '---' },
  max: { type: 'number', defaultValue: 6 },
  allowOverflow: { type: 'boolean', defaultValue: false },
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
})

export const editControls = defineControls({
  readOnly: { type: 'boolean', defaultValue: false },
  disabled: { type: 'boolean', defaultValue: false },
  autoResize: { type: 'boolean', defaultValue: true },
  maxLength: { type: 'number', defaultValue: 1000 },
  submitMode: {
    type: 'select',
    options: ['enter', 'blur', 'both', 'none'] as const,
    defaultValue: 'both',
  },
  activationMode: {
    type: 'select',
    options: ['focus', 'dblclick', 'click'] as const,
    defaultValue: 'focus',
  },
})

export const fileUploadControls = defineControls({
  accept: { type: 'string', defaultValue: '' },
  maxFiles: { type: 'number', defaultValue: 1 },
  disabled: { type: 'boolean', defaultValue: false },
  dropzone: { type: 'boolean', defaultValue: true },
})

export const floatingPanelControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  resizable: { type: 'boolean', defaultValue: true },
  draggable: { type: 'boolean', defaultValue: true },
  lockAspectRatio: { type: 'boolean', defaultValue: false },
  closeOnEscape: { type: 'boolean', defaultValue: true },
  persistRect: { type: 'boolean', defaultValue: false },
})

export const hoverCardControls = defineControls({
  openDelay: { type: 'number', defaultValue: 700 },
  closeDelay: { type: 'number', defaultValue: 300 },
})

export const menuControls = defineControls({
  closeOnSelect: { type: 'boolean', defaultValue: true },
  loopFocus: { type: 'boolean', defaultValue: false },
})

export const numberInputControls = defineControls({
  'disabled': { type: 'boolean', defaultValue: false },
  'clampValueOnBlur': { type: 'boolean', defaultValue: true },
  'allowMouseWheel': { type: 'boolean', defaultValue: false },
  'spinOnPress': { type: 'boolean', defaultValue: true },
  'step': { type: 'number', defaultValue: 1 },
  'min': { type: 'number', defaultValue: 0 },
  'max': { type: 'number', defaultValue: 100 },
  'locale': {
    type: 'select',
    options: ['en-US', 'en-GB', 'fr-FR', 'de-DE', 'ja-JP', 'mk-MK', 'zh-CN'] as const,
  },
  'formatOptions.maximumFractionDigits': { type: 'number' },
  'formatOptions.minimumFractionDigits': { type: 'number' },
  'formatOptions.style': {
    type: 'select',
    options: ['decimal', 'currency', 'percent'] as const,
  },
  'formatOptions.currency': {
    type: 'select',
    defaultValue: 'USD',
    options: ['USD', 'EUR', 'JPY', 'GBP', 'MXN', 'CNY'] as const,
  },
})

export const pinInputControls = defineControls({
  mask: { type: 'boolean', defaultValue: false },
  otp: { type: 'boolean', defaultValue: false },
  blurOnComplete: { type: 'boolean', defaultValue: false },
  type: { type: 'select', options: ['numeric', 'alphanumeric', 'alphabetic'] as const, defaultValue: 'numeric' },
})

export const paginationControls = defineControls({
  pageSize: { type: 'number', defaultValue: 10 },
  siblingCount: { type: 'number', defaultValue: 1 },
})

export const popoverControls = defineControls({
  modal: { type: 'boolean', defaultValue: false },
  portalled: { type: 'boolean', defaultValue: true },
  autoFocus: { type: 'boolean', defaultValue: true },
  closeOnEsc: { type: 'boolean', defaultValue: true },
})

export const progressControls = defineControls({
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
})

export const qrCodeControls = defineControls({
  'value': { type: 'string', defaultValue: 'https://github.com/destyler' },
  'encoding.ecc': { type: 'select', options: ['L', 'M', 'Q', 'H'] as const, defaultValue: 'H' },
  'encoding.boostEcc': { type: 'boolean', defaultValue: false },
})

export const radioControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  readOnly: { type: 'boolean', defaultValue: false },
})

export const selectControls = defineControls({
  multiple: { type: 'boolean', defaultValue: false },
  disabled: { type: 'boolean', defaultValue: false },
  loopFocus: { type: 'boolean', defaultValue: true },
  readOnly: { type: 'boolean', defaultValue: false },
  deselectable: { type: 'boolean', defaultValue: false },
  closeOnSelect: { type: 'boolean', defaultValue: true },
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
})

export const signatureControls = defineControls({
  'disabled': { type: 'boolean', defaultValue: false },
  'readOnly': { type: 'boolean', defaultValue: false },
  'drawing.size': { type: 'number', defaultValue: 2 },
  'drawing.simulatePressure': { type: 'boolean', defaultValue: true },
})

export const sliderControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  readOnly: { type: 'boolean', defaultValue: false },
  orientation: { type: 'select', options: ['horizontal', 'vertical'] as const, defaultValue: 'horizontal' },
  thumbAlignment: { type: 'select', options: ['contain', 'center'] as const, defaultValue: 'contain' },
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
  origin: { type: 'select', options: ['center', 'start'] as const, defaultValue: 'start' },
  min: { type: 'number', defaultValue: 0 },
  max: { type: 'number', defaultValue: 100 },
  step: { type: 'number', defaultValue: 1 },
})

export const splitterControls = defineControls({
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
  orientation: { type: 'select', options: ['vertical', 'horizontal'] as const, defaultValue: 'horizontal' },
})

export const stepsControls = defineControls({
  linear: { type: 'boolean', defaultValue: false },
  orientation: { type: 'select', options: ['horizontal', 'vertical'] as const, defaultValue: 'horizontal' },
})

export const switchControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  readOnly: { type: 'boolean', defaultValue: false },
})

export const tabsControls = defineControls({
  activationMode: { type: 'select', options: ['manual', 'automatic'] as const, defaultValue: 'automatic' },
  deselectable: { type: 'boolean', defaultValue: false },
  loopFocus: { type: 'boolean', defaultValue: true },
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
  orientation: { type: 'select', options: ['vertical', 'horizontal'] as const, defaultValue: 'horizontal' },
})

export const toggleControls = defineControls({
  disabled: { type: 'boolean', defaultValue: false },
  loopFocus: { type: 'boolean', defaultValue: true },
  multiple: { type: 'boolean', defaultValue: false },
  rovingFocus: { type: 'boolean', defaultValue: true },
})

export const treeControls = defineControls({
  dir: { type: 'select', options: ['ltr', 'rtl'] as const, defaultValue: 'ltr' },
  selectionMode: { type: 'select', options: ['single', 'multiple'] as const, defaultValue: 'single' },
  openOnClick: { type: 'boolean', defaultValue: true },
})
