/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as toggle from '@destyler/toggle'
import { createMemo, createUniqueId } from 'solid-js'

export default function TogglePage() {
  const [state, send] = useMachine(toggle.machine({
    id: createUniqueId(),
    multiple: true,
    value: ['bold'],
  }))

  const api = createMemo(() => toggle.connect(state, send, normalizeProps))

  return (
    <div class="toggle-group-container">
      <div
        {...api().getRootProps()}
        class="toggle-group-root"
      >
        {['bold', 'italic', 'underline'].map(item => (
          <button
            {...api().getItemProps({ value: item })}
            class="toggle-group-item"
          >
            {item[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
