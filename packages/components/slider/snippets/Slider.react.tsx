import { normalizeProps, useMachine } from '@destyler/react'
import * as slider from '@destyler/slider'
import { useId } from 'react'
import './style.css'

export default function Slider({ className = '' }: { className?: string }) {
  const [state, send] = useMachine(slider.machine({
    id: useId(),
    value: [60],
  }))

  const api = slider.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className={`${className}`}>
      <div {...api.getControlProps()}>
        <div {...api.getTrackProps()}>
          <div {...api.getRangeProps()} />
        </div>
        {api.value.map((_, index) => (
          <div key={index} {...api.getThumbProps({ index })}>
            <input {...api.getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
    </div>
  )
}
