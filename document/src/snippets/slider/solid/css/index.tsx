/** @jsxImportSource solid-js */
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Slider() {
  const [state, send] = useMachine(slider.machine({
    id: createUniqueId(),
    value: [60],
  }))

  const api = createMemo(() => slider.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="slider-root">
      <div {...api().getControlProps()} class="slider-control">
        <div
          {...api().getTrackProps()}
          class="slider-track"
        >
          <div
            {...api().getRangeProps()}
            class="slider-range"
          />
        </div>
        {api().value.map((_, index) => (
          <div
            {...api().getThumbProps({ index })}
            class="slider-thumb"
          >
            <input {...api().getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
    </div>
  )
}
