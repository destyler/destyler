/** @jsxImportSource solid-js */
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function Slider() {
  const [state, send] = useMachine(slider.machine({
    id: createUniqueId(),
    value: [60],
  }))

  const api = createMemo(() => slider.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class="flex w-full touch-none select-none items-center">
      <div {...api().getControlProps()} class="w-full relative">
        <div
          {...api().getTrackProps()}
          class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
        >
          <div
            {...api().getRangeProps()}
            class="absolute h-full bg-primary"
          />
        </div>
        {api().value.map((_, index) => (
          <div
            {...api().getThumbProps({ index })}
            class="absolute top--1.5 cursor-pointer block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            <input {...api().getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
    </div>
  )
}
