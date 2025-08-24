import { normalizeProps, useMachine } from '@destyler/react'
import * as toggle from '@destyler/toggle'
import { useId } from 'react'

export default function TogglePage() {
  const [state, send] = useMachine(toggle.machine({
    id: useId(),
    multiple: true,
    value: ['bold'],
  }))

  const api = toggle.connect(state, send, normalizeProps)

  return (
    <div className="flex items-center justify-center">
      <div
        {...api.getRootProps()}
        className="inline-flex items-center justify-center gap-1 rounded-md p-1 shadow-sm"
      >
        {['bold', 'italic', 'underline'].map(item => (
          <button
            key={item}
            {...api.getItemProps({ value: item })}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md px-3 text-sm
            font-medium ring-offset-background transition-all focus-visible:outline-none
            focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
            disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-primary
            hover:bg-primary hover:text-accent data-[state=on]:text-accent text-foreground"
          >
            {item[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
