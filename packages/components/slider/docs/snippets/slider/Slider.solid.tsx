/** @jsxImportSource solid-js */
import * as slider from '@destyler/slider'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@docs/styles/components/slider.css'

export default function Slider({ className = '' }: { className?: string }) {
  const [state, send] = useMachine(slider.machine({
    id: createUniqueId(),
    value: [60],
  }))

  const api = createMemo(() => slider.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()} class={`${className}`}>
      <div {...api().getControlProps()}>
        <div {...api().getTrackProps()}>
          <div {...api().getRangeProps()} />
        </div>
        {api().value.map((_, index) => (
          <div {...api().getThumbProps({ index })}>
            <input {...api().getHiddenInputProps({ index })} />
          </div>
        ))}
      </div>
    </div>
  )
}
