/** @jsxImportSource solid-js */
import * as colorPicker from '@destyler/color-picker'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'

export default function ColorPicker() {
  const [state, send] = useMachine(colorPicker.machine({
    id: createUniqueId(),
    value: colorPicker.parse('hsl(240,5.9%,10%)'),
  }))

  const api = createMemo(() => colorPicker.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <input {...api().getHiddenInputProps()} />
      <div {...api().getControlProps()}>
        <button {...api().getTriggerProps()}>
          <div {...api().getTransparencyGridProps({ size: '8px' })} />
          <div {...api().getSwatchProps({ value: api().value })} />
        </button>
        <div class="flex flex-col gap-1.5 mt-0!">
          <input {...api().getChannelInputProps({ channel: 'hex' })} />
          <input {...api().getChannelInputProps({ channel: 'alpha' })} />
        </div>
      </div>

      {api().open && (
        <Portal mount={document.body}>
          <div data-layout="sinppets" {...api().getPositionerProps()}>
            <div {...api().getContentProps()}>
              <div {...api().getAreaProps()}>
                <div {...api().getAreaBackgroundProps()} />
                <div {...api().getAreaThumbProps()} />
              </div>

              <div {...api().getChannelSliderProps({ channel: 'hue' })}>
                <div {...api().getChannelSliderTrackProps({ channel: 'hue' })} />
                <div {...api().getChannelSliderThumbProps({ channel: 'hue' })} />
              </div>

              <div {...api().getChannelSliderProps({ channel: 'alpha' })}>
                <div {...api().getTransparencyGridProps({ size: '8px' })} />
                <div {...api().getChannelSliderTrackProps({ channel: 'alpha' })} />
                <div {...api().getChannelSliderThumbProps({ channel: 'alpha' })} />
              </div>
            </div>
          </div>
        </Portal>

      )}
    </div>
  )
}
