export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; control: string; trigger: string; label: string; input: string; hiddenInput: string; content: string; area: string; areaGradient: string; positioner: string; formatSelect: string; areaThumb: string; channelInput(id: string): string; channelSliderTrack(id: ColorChannel): string; }>',
    desc: 'The ids of the elements in the color picker. Useful for composition.'
  },
  {
    name: 'value',
    type: 'Color',
    desc: 'The current color value'
  },
  {
    name: 'disabled',
    type: 'boolean',
    desc: 'Whether the color picker is disabled'
  },
  {
    name: 'readOnly',
    type: 'boolean',
    desc: 'Whether the color picker is read-only'
  },
  {
    name: 'required',
    type: 'boolean',
    desc: 'Whether the color picker is required'
  },
  {
    name: 'invalid',
    type: 'boolean',
    desc: 'Whether the color picker is invalid'
  },
  {
    name: 'onValueChange',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Handler that is called when the value changes, as the user drags.'
  },
  {
    name: 'onValueChangeEnd',
    type: '(details: ValueChangeDetails) => void',
    desc: 'Handler that is called when the user stops dragging.'
  },
  {
    name: 'onOpenChange',
    type: '(details: OpenChangeDetails) => void',
    desc: 'Handler that is called when the user opens or closes the color picker.'
  },
  {
    name: 'name',
    type: 'string',
    desc: 'The name for the form input'
  },
  {
    name: 'positioning',
    type: 'PositioningOptions',
    desc: 'The positioning options for the color picker'
  },
  {
    name: 'initialFocusEl',
    type: '() => HTMLElement',
    desc: 'The initial focus element when the color picker is opened.'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the color picker is open'
  },
  {
    name: 'open.controlled',
    type: 'boolean',
    desc: 'Whether the color picker open state is controlled by the user'
  },
  {
    name: 'format',
    type: 'ColorFormat',
    desc: 'The color format to use'
  },
  {
    name: 'onFormatChange',
    type: '(details: FormatChangeDetails) => void',
    desc: 'Function called when the color format changes'
  },
  {
    name: 'closeOnSelect',
    type: 'boolean',
    desc: 'Whether to close the color picker when a swatch is selected'
  },
  {
    name: 'openAutoFocus',
    type: 'boolean',
    desc: 'Whether to auto focus the color picker when it is opened'
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.'
  },
  {
    name: 'getRootNode',
    type: '() => Node | ShadowRoot | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
  },
  {
    name: 'onPointerDownOutside',
    type: '(event: PointerDownOutsideEvent) => void',
    desc: 'Function called when the pointer is pressed down outside the component'
  },
  {
    name: 'onFocusOutside',
    type: '(event: FocusOutsideEvent) => void',
    desc: 'Function called when the focus is moved outside the component'
  },
  {
    name: 'onInteractOutside',
    type: '(event: InteractOutsideEvent) => void',
    desc: 'Function called when an interaction happens outside the component'
  },
]

export const matchApi = [
  {
    name: 'dragging',
    type: 'boolean',
    desc: 'Whether the color picker is being dragged'
  },
  {
    name: 'open',
    type: 'boolean',
    desc: 'Whether the color picker is open'
  },
  {
    name: 'value',
    type: 'Color',
    desc: 'The current color value (as a Color object)'
  },
  {
    name: 'valueAsString',
    type: 'string',
    desc: 'The current color value (as a string)'
  },
  {
    name: 'setValue',
    type: '(value: string | Color) => void',
    desc: 'Function to set the color value'
  },
  {
    name: 'getChannelValue',
    type: '(channel: ColorChannel) => string',
    desc: 'Function to get the value of a specific channel'
  },
  {
    name: 'getChannelValueText',
    type: '(channel: ColorChannel, locale: string) => string',
    desc: 'Function to get the formatted and localized value of a specific channel'
  },
  {
    name: 'setChannelValue',
    type: '(channel: ColorChannel, value: number) => void',
    desc: 'Function to set the color value of a specific channel'
  },
  {
    name: 'format',
    type: 'ColorFormat',
    desc: 'The current color format'
  },
  {
    name: 'setFormat',
    type: '(format: ColorFormat) => void',
    desc: 'Function to set the color format'
  },
  {
    name: 'alpha',
    type: 'number',
    desc: 'The alpha value of the color'
  },
  {
    name: 'setAlpha',
    type: '(value: number) => void',
    desc: 'Function to set the color alpha'
  },
  {
    name: 'setOpen',
    type: '(open: boolean) => void',
    desc: 'Function to open or close the color picker'
  },
]

export const styleApi = {
  root: [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'root' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-readonly', desc: 'Present when read-only' },
    { name: 'data-invalid', desc: 'Present when invalid' },
  ],
  label: [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'label' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-readonly', desc: 'Present when read-only' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  control: [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'control' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-readonly', desc: 'Present when read-only' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-state', desc: '"open" | "closed"' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  trigger: [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'trigger' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-readonly', desc: 'Present when read-only' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-placement', desc: 'The placement of the trigger' },
    { name: 'data-state', desc: '"open" | "closed"' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  content: [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'content' },
    { name: 'data-placement', desc: 'The placement of the content' },
    { name: 'data-state', desc: '"open" | "closed"' },
  ],
  'value-text': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'value-text' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-focus', desc: 'Present when focused' },
  ],
  area: [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'area' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-readonly', desc: 'Present when read-only' },
  ],
  'area-background': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'area-background' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-readonly', desc: 'Present when read-only' },
  ],
  'area-thumb': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'area-thumb' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-readonly', desc: 'Present when read-only' },
  ],
  'channel-slider': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'channel-slider' },
    { name: 'data-channel', desc: 'The color channel of the channelslider' },
    { name: 'data-orientation', desc: 'The orientation of the channelslider' },
  ],
  'channel-slider-track': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'channel-slider-track' },
    { name: 'data-channel', desc: 'The color channel of the channelslidertrack' },
    { name: 'data-orientation', desc: 'The orientation of the channelslidertrack' },
  ],
  'channel-slider-label': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'channel-slider-label' },
    { name: 'data-channel', desc: 'The color channel of the channelsliderlabel' },
  ],
  'channel-slider-value-text': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'channel-slider-value-text' },
    { name: 'data-channel', desc: 'The color channel of the channelslidervaluetext' },
  ],
  'channel-slider-thumb': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'channel-slider-thumb' },
    { name: 'data-channel', desc: 'The color channel of the channelsliderthumb' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-orientation', desc: 'The orientation of the channelsliderthumb' },
  ],
  'channel-input': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'channel-input' },
    { name: 'data-channel', desc: 'The color channel of the channelinput' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-readonly', desc: 'Present when read-only' },
  ],
  'eye-dropper-trigger': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'eye-dropper-trigger' },
    { name: 'data-disabled', desc: 'Present when disabled' },
    { name: 'data-invalid', desc: 'Present when invalid' },
    { name: 'data-readonly', desc: 'Present when read-only' },
  ],
  'swatch-trigger': [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'swatch-trigger' },
    { name: 'data-state', desc: '"checked" | "unchecked"' },
    { name: 'data-value', desc: 'The value of the item' },
    { name: 'data-disabled', desc: 'Present when disabled' },
  ],
  swatch: [
    { name: 'data-scope', desc: 'color-picker' },
    { name: 'data-part', desc: 'swatch' },
    { name: 'data-state', desc: '"checked" | "unchecked"' },
    { name: 'data-value', desc: 'The value of the item' },
  ],
}

export const keyboardApi = [
  {
    name: 'Enter',
    desc: 'When focus is on the trigger, opens the color picker. When focus is on a trigger of a swatch, selects the color (and closes the color picker). When focus is on the input or channel inputs, selects the color'
  },
  {
    name: 'ArrowLeft',
    desc: 'When focus is on the color area, decreases the hue value of the color. When focus is on the channel sliders, decreases the value of the channel'
  },
  {
    name: 'ArrowRight',
    desc: 'When focus is on the color area, increases the hue value of the color. When focus is on the channel sliders, increases the value of the channel'
  },
  {
    name: 'ArrowUp',
    desc: 'When focus is on the color area, increases the saturation value of the color. When focus is on the channel sliders, increases the value of the channel'
  },
  {
    name: 'ArrowDown',
    desc: 'When focus is on the color area, decreases the saturation value of the color. When focus is on the channel sliders, decreases the value of the channel'
  },
  {
    name: 'Esc',
    desc: 'Closes the color picker and moves focus to the trigger'
  },
]
