import { defineControls } from './define-controls'

export const aspectRatioControls = defineControls({
  ratio: { type: 'number', defaultValue: 16 / 9 },
})
