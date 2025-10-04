export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; thumb(index: number): string; hiddenInput(index: number): string; control: string; track: string; range: string; label: string; valueText: string; marker(index: number): string; }>',
    desc: 'The ids of the elements in the range slider. Useful for composition.',
  },
  {
    name: 'aria-label',
    type: 'string[]',
    desc: 'The aria-label of each slider thumb. Useful for providing an accessible name to the slider',
  },
  {
    name: 'aria-labelledby',
    type: 'string[]',
    desc: 'The `id` of the elements that labels each slider thumb. Useful for providing an accessible name to the slider',
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name associated with each slider thumb (when used in a form)',
  },
  {
    name: 'form',
    type: 'string',
    desc: 'The associate form of the underlying input element.',
  },
  {
    name: 'value',
    type: 'number[]',
    desc: 'The value of the range slider',
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the slider is disabled',
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the slider is read-only',
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the slider is invalid',
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Function invoked when the value of the slider changes',
  },
  {
    name: 'onValueChangeEnd',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Function invoked when the slider value change is done',
  },
  {
    name: 'onFocusChange',
    type: '(details: FocusChangeDetails) => void',
    desc: 'Function invoked when the slider\'s focused index changes',
  },
  {
    name: 'getAriaValueText',
    type: '(details: ValueTextDetails) => string',
    desc: 'Function that returns a human readable value for the slider thumb',
  },
  {
    name: 'min',
    type: 'number',
    desc: 'The minimum value of the slider',
  },
  {
    name: 'max',
    type: 'number',
    desc: 'The maximum value of the slider',
  },
  {
    name: 'step',
    type: 'number',
    desc: 'The step value of the slider',
  },
  {
    name: 'minStepsBetweenThumbs',
    type: 'number',
    desc: 'The minimum permitted steps between multiple thumbs.',
  },
  {
    name: 'orientation',
    type: '"vertical" | "horizontal"',
    desc: 'The orientation of the slider',
  },
  {
    name: 'origin',
    type: '"start" | "center"',
    desc: 'The origin of the slider range - "start": Useful when the value represents an absolute value - "center": Useful when the value represents an offset (relative)',
  },
  {
    name: 'thumbAlignment',
    type: '"center" | "contain"',
    desc: 'The alignment of the slider thumb relative to the track - `center`: the thumb will extend beyond the bounds of the slider track. - `contain`: the thumb will be contained within the bounds of the track.',
  },
  {
    name: 'thumbSize',
    type: '{ width: number; height: number; }',
    desc: 'The slider thumbs dimensions',
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.',
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.',
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.',
  },
]

export const matchApi = [
  {
    name: 'value',
    type: 'number[]',
    desc: 'The value of the slider.',
  },
  {
    name: 'dragging',
    type: 'boolean',
    desc: 'Whether the slider is being dragged.',
  },
  {
    name: 'focused',
    type: 'boolean',
    desc: 'Whether the slider is focused.',
  },
  {
    name: 'setValue',
    type: '(value: number[]) => void',
    desc: 'Function to set the value of the slider.',
  },
  {
    name: 'getThumbValue',
    type: '(index: number) => number',
    desc: 'Returns the value of the thumb at the given index.',
  },
  {
    name: 'setThumbValue',
    type: '(index: number, value: number) => void',
    desc: 'Sets the value of the thumb at the given index.',
  },
  {
    name: 'getValuePercent',
    type: '(value: number) => number',
    desc: 'Returns the percent of the thumb at the given index.',
  },
  {
    name: 'getPercentValue',
    type: '(percent: number) => number',
    desc: 'Returns the value of the thumb at the given percent.',
  },
  {
    name: 'getThumbPercent',
    type: '(index: number) => number',
    desc: 'Returns the percent of the thumb at the given index.',
  },
  {
    name: 'setThumbPercent',
    type: '(index: number, percent: number) => void',
    desc: 'Sets the percent of the thumb at the given index.',
  },
  {
    name: 'getThumbMin',
    type: '(index: number) => number',
    desc: 'Returns the min value of the thumb at the given index.',
  },
  {
    name: 'getThumbMax',
    type: '(index: number) => number',
    desc: 'Returns the max value of the thumb at the given index.',
  },
  {
    name: 'increment',
    type: '(index: number) => void',
    desc: 'Function to increment the value of the slider at the given index.',
  },
  {
    name: 'decrement',
    type: '(index: number) => void',
    desc: 'Function to decrement the value of the slider at the given index.',
  },
  {
    name: 'focus',
    type: '() => void',
    desc: 'Function to focus the slider. This focuses the first thumb.',
  },
]

export const styleApi = {
  root: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'root' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-orientation', desc: 'The orientation of the slider' },
    { name: 'data-dragging', desc: 'Present when in the dragging state' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  label: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'label' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-orientation', desc: 'The orientation of the label' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-dragging', desc: 'Present when in the dragging state' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  valueText: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'value-text' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-orientation', desc: 'The orientation of the valuetext' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  track: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'track' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-dragging', desc: 'Present when in the dragging state' },
    { name: 'data-orientation', desc: 'The orientation of the track' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  thumb: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'thumb' },
    { name: 'data-index', desc: 'The index of the item' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-orientation', desc: 'The orientation of the thumb' },
    { name: 'data-focus', desc: 'Present when focused' },
    { name: 'data-dragging', desc: 'Present when in the dragging state' },
  ],
  range: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'range' },
    { name: 'data-dragging', desc: 'Present when in the dragging state' },
    { name: 'data-focus', desc: 'Present when focused' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-orientation', desc: 'The orientation of the range' },
  ],
  control: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'control' },
    { name: 'data-dragging', desc: 'Present when in the dragging state' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-orientation', desc: 'The orientation of the control' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  markerGroup: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'marker-group' },
    { name: 'data-orientation', desc: 'The orientation of the markergroup' },
  ],
  marker: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'marker' },
    { name: 'data-orientation', desc: 'The orientation of the marker' },
    { name: 'data-value', desc: 'The value of the item' },
    { name: 'data-disabled', desc: 'Present when disabled' },
  ],
  draggingIndicator: [
    { name: 'data-scope', desc: 'slider' },
    { name: 'data-part', desc: 'dragging-indicator' },
    { name: 'data-orientation', desc: 'The orientation of the draggingindicator' },
    { name: 'data-state', desc: '"open" | "closed"' },
  ],
}

export const keyboardApi = [
  {
    name: 'ArrowRight',
    desc: 'Increments the slider based on defined step',
  },
  {
    name: 'ArrowLeft',
    desc: 'Decrements the slider based on defined step',
  },
  {
    name: 'ArrowUp',
    desc: 'Increases the value by the step amount.',
  },
  {
    name: 'ArrowDown',
    desc: 'Decreases the value by the step amount.',
  },
  {
    name: 'PageUp',
    desc: 'Increases the value by a larger step',
  },
  {
    name: 'PageDown',
    desc: 'Decreases the value by a larger step',
  },
  {
    name: 'Shift + ArrowUp',
    desc: 'Increases the value by a larger step',
  },
  {
    name: 'Shift + ArrowDown',
    desc: 'Decreases the value by a larger step',
  },
  {
    name: 'Home',
    desc: 'Sets the value to its minimum.',
  },
  {
    name: 'End',
    desc: 'Sets the value to its maximum.',
  }
]
