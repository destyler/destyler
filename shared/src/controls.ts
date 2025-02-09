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
