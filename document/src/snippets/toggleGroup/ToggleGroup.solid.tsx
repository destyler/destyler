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
    <div class="flex items-center justify-center mt-0!">
      <div
        {...api().getRootProps()}
        class="inline-flex items-center justify-center gap-1 rounded-md p-1 shadow-sm mt-0!"
      >
        {['bold', 'italic', 'underline'].map(item => (
          <button
            {...api().getItemProps({ value: item })}
            class={`inline-flex items-center justify-center h-9 w-9 rounded-md px-3 text-sm
            font-medium ring-offset-background transition-all focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-0!
            disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary
            hover:bg-primary hover:text-accent data-[state=on]:text-accent text-foreground`}
          >
            {item[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
