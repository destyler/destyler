import { normalizeProps, useMachine } from '@destyler/react'
import * as slider from '@destyler/slider'
import { useId } from 'react'

export default function Slider() {
  const [state, send] = useMachine(slider.machine({
    id: useId(),
    value: [60],
  }))

  const api = slider.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="flex touch-none select-none items-center">
      <div {...api.getControlProps()} className="w-full relative">
        <div
          {...api.getTrackProps()}
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
        >
          <div
            {...api.getRangeProps()}
            className="absolute h-full bg-primary"
          />
        </div>
        {api.value.map((_, index) => (
          <div
            key={index}
            {...api.getThumbProps({ index })}
            className="absolute top--1.5 cursor-pointer block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <input {...api.getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
    </div>
  )
}
