import * as progress from '@destyler/progress'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function Progress({ className = '' }: { className?: string }) {
  const [state, send] = useMachine(progress.machine({
    id: useId(),
    value: 30, 
  }))

  const api = progress.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className={`w-full ${className}`}>
      <div
        {...api.getTrackProps()}
        className="h-2 w-full overflow-hidden rounded-full bg-secondary"
      >
        <div
          {...api.getRangeProps()}
          className="h-full w-full flex-1 bg-primary transition-all duration-300 ease-out"
        />
      </div>
    </div>
  )
}
