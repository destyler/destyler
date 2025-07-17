/** @jsxImportSource solid-js */
import * as colorPicker from '@destyler/color-picker'
import { colorPickerControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/color-picker.css'

export default function ColorPicker() {
  const controls = useControls(colorPickerControls)
  const id = createUniqueId()

  const [state, send] = useMachine(colorPicker.machine({
    id,
    name: 'color',
    format: 'hsla',
    value: colorPicker.parse('hsl(0, 100%, 50%)'),
  }), {
    context: controls.context,
  })

  const api = createMemo(() => colorPicker.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="color-picker-root">
      <label {...api().getLabelProps()} class="color-picker-label">
        Select Color:
        {' '}
        <span data-testid="value-text">{api().valueAsString}</span>
      </label>
      <input {...api().getHiddenInputProps()} />
      <div {...api().getControlProps()} class="color-picker-control">
        <button {...api().getTriggerProps()} class="color-picker-trigger">
          <div {...api().getTransparencyGridProps({ size: '10px' })} class="color-picker-transparency-grid" />
          <div {...api().getSwatchProps({ value: api().value })} class="color-picker-swatch" />
        </button>
        <div class="color-picker-input-box">
          <input
            {...api().getChannelInputProps({ channel: 'hex' })}
            class="color-picker-channel-input"
          />
          <input
            {...api().getChannelInputProps({ channel: 'alpha' })}
            class="color-picker-channel-input"
          />
        </div>
      </div>

      <div {...api().getPositionerProps()} class="color-picker-positioner">
        <div {...api().getContentProps()} class="color-picker-content">
          <div {...api().getAreaProps()} class="color-picker-area">
            <div {...api().getAreaBackgroundProps()} class="color-picker-area-background" />
            <div {...api().getAreaThumbProps()} class="color-picker-area-thumb" />
          </div>

          <div {...api().getChannelSliderProps({ channel: 'hue' })} class="color-picker-hue-slider">
            <div {...api().getChannelSliderTrackProps({ channel: 'hue' })} class="color-picker-hue-slider-track" />
            <div {...api().getChannelSliderThumbProps({ channel: 'hue' })} class="color-picker-hue-slider-thumb" />
          </div>

          <div {...api().getChannelSliderProps({ channel: 'alpha' })} class="color-picker-alpha-slider">
            <div {...api().getTransparencyGridProps({ size: '12px' })} class="color-picker-alpha-grid" />
            <div {...api().getChannelSliderTrackProps({ channel: 'alpha' })} class="color-picker-alpha-slider-track" />
            <div {...api().getChannelSliderThumbProps({ channel: 'alpha' })} class="color-picker-alpha-slider-thumb" />
          </div>
        </div>
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
