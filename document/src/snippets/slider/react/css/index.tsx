import { normalizeProps, useMachine } from '@destyler/react'
import * as slider from '@destyler/slider'
import { useId } from 'react'
import './index.css'

export default function Slider() {
  const [state, send] = useMachine(slider.machine({
    id: useId(),
    value: [60],
  }))

  const api = slider.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="slider-root">
      <div {...api.getControlProps()} className="slider-control">
        <div
          {...api.getTrackProps()}
          className="slider-track"
        >
          <div
            {...api.getRangeProps()}
            className="slider-range"
          />
        </div>
        {api.value.map((_, index) => (
          <div
            key={index}
            {...api.getThumbProps({ index })}
            className="slider-thumb"
          >
            <input {...api.getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
    </div>
  )
}
