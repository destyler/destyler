import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/react'
import { colorPickerControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/color-picker.css'

export default function ColorPicker() {
  const controls = useControls(colorPickerControls)
  const id = useId()

  const [state, send] = useMachine(colorPicker.machine({
    id,
    name: 'color',
    format: 'hsla',
    value: colorPicker.parse('hsl(0, 100%, 50%)'),
  }), {
    context: controls.context,
  })

  const api = colorPicker.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="color-picker-root">
      <label {...api.getLabelProps()} className="color-picker-label">
        Select Color:
        {' '}
        <span data-testid="value-text">{api.valueAsString}</span>
      </label>
      <input {...api.getHiddenInputProps()} />
      <div {...api.getControlProps()} className="color-picker-control">
        <button {...api.getTriggerProps()} className="color-picker-trigger">
          <div {...api.getTransparencyGridProps({ size: '10px' })} className="color-picker-transparency-grid" />
          <div {...api.getSwatchProps({ value: api.value })} className="color-picker-swatch" />
        </button>
        <div className="color-picker-input-box">
          <input
            {...api.getChannelInputProps({ channel: 'hex' })}
            className="color-picker-channel-input"
          />
          <input
            {...api.getChannelInputProps({ channel: 'alpha' })}
            className="color-picker-channel-input"
          />
        </div>
      </div>

      <div {...api.getPositionerProps()} className="color-picker-positioner">
        <div {...api.getContentProps()} className="color-picker-content">
          <div {...api.getAreaProps()} className="color-picker-area">
            <div {...api.getAreaBackgroundProps()} className="color-picker-area-background" />
            <div {...api.getAreaThumbProps()} className="color-picker-area-thumb" />
          </div>

          <div {...api.getChannelSliderProps({ channel: 'hue' })} className="color-picker-hue-slider">
            <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} className="color-picker-hue-slider-track" />
            <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} className="color-picker-hue-slider-thumb" />
          </div>

          <div {...api.getChannelSliderProps({ channel: 'alpha' })} className="color-picker-alpha-slider">
            <div {...api.getTransparencyGridProps({ size: '12px' })} className="color-picker-alpha-grid" />
            <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} className="color-picker-alpha-slider-track" />
            <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} className="color-picker-alpha-slider-thumb" />
          </div>
        </div>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
