import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'
import './index.css'

export default function ColorPicker() {
  const id = useId()
  const [state, send] = useMachine(colorPicker.machine({
    id,
    value: colorPicker.parse('hsl(240,5.9%,10%)'),
  }))

  const api = colorPicker.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="color-picker-root">
      <input {...api.getHiddenInputProps()} className="color-picker-hidden-input" />
      <div {...api.getControlProps()} className="color-picker-control">
        <button
          {...api.getTriggerProps()}
          className="color-picker-trigger"
        >
          <div {...api.getTransparencyGridProps({ size: '8px' })} className="color-picker-transparency-grid" />
          <div {...api.getSwatchProps({ value: api.value })} className="color-picker-swatch" />
        </button>
        <div className="color-picker-input-container">
          <input
            {...api.getChannelInputProps({ channel: 'hex' })}
            className="color-picker-channel-input color-picker-channel-input-hex"
          />
          <input
            {...api.getChannelInputProps({ channel: 'alpha' })}
            className="color-picker-channel-input color-picker-channel-input-alpha"
          />
        </div>
      </div>

      {api.open && createPortal(
        <div {...api.getPositionerProps()} className="color-picker-positioner">
          <div {...api.getContentProps()} className="color-picker-content">
            <div {...api.getAreaProps()} className="color-picker-area">
              <div {...api.getAreaBackgroundProps()} className="color-picker-area-background" />
              <div {...api.getAreaThumbProps()} className="color-picker-area-thumb" />
            </div>

            <div {...api.getChannelSliderProps({ channel: 'hue' })} className="color-picker-channel-slider color-picker-channel-slider-hue">
              <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} className="color-picker-channel-slider-track" />
              <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} className="color-picker-channel-slider-thumb" />
            </div>

            <div {...api.getChannelSliderProps({ channel: 'alpha' })} className="color-picker-channel-slider color-picker-channel-slider-alpha">
              <div {...api.getTransparencyGridProps({ size: '8px' })} className="color-picker-transparency-grid" />
              <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} className="color-picker-channel-slider-track" />
              <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} className="color-picker-channel-slider-thumb" />
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
