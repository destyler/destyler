import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

export default function Progress({ className = '' }: { className?: string }) {
  const [state, send] = useMachine(progress.machine({
    id: useId(),
    value: 30,
  }))

  const api = progress.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className={`${className}`}>
      <div {...api.getTrackProps()}>
        <div {...api.getRangeProps()} />
      </div>
    </div>
  )
}
