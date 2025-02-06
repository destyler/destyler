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
  collapsible: { type: 'boolean', defaultValue: false },
  multiple: { type: 'boolean', defaultValue: false },
  orientation: { type: 'select', options: ['horizontal', 'vertical'] as const, defaultValue: 'vertical' },
})
