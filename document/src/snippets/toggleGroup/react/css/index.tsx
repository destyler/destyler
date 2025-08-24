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
    <div className="toggle-group-container">
      <div
        {...api.getRootProps()}
        className="toggle-group-root"
      >
        {['bold', 'italic', 'underline'].map(item => (
          <button
            key={item}
            {...api.getItemProps({ value: item })}
            className="toggle-group-item"
          >
            {item[0].toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
