/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as toggle from '@destyler/toggle'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

export default function TogglePage() {
  const [state, send] = useMachine(toggle.machine({
    id: createUniqueId(),
    multiple: true,
    value: ['bold'],
  }))

  const api = createMemo(() => toggle.connect(state, send, normalizeProps))

  return (
    <div class="flex items-center justify-center mt-0!">
      <div {...api().getRootProps()}>
        {['bold', 'italic', 'underline'].map(item => (
          <button {...api().getItemProps({ value: item })}>
            {item[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
