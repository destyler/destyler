import { normalizeProps, useMachine } from '@destyler/react'
import * as toggle from '@destyler/toggle'
import { useId } from 'react'
import './style.css'

export default function TogglePage() {
  const [state, send] = useMachine(toggle.machine({
    id: useId(),
    multiple: true,
    value: ['bold'],
  }))

  const api = toggle.connect(state, send, normalizeProps)

  return (
    <div className="flex items-center justify-center mt-0!">
      <div {...api.getRootProps()}>
        {['bold', 'italic', 'underline'].map(item => (
          <button key={item} {...api.getItemProps({ value: item })}>
            {item[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
