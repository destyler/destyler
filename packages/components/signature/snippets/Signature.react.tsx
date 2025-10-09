import { normalizeProps, useMachine } from '@destyler/react'
import * as signature from '@destyler/signature'
import { useId, useMemo } from 'react'
import './style.css'

export default function Signature() {
  const [state, send] = useMachine(signature.machine({ id: useId() }))

  const api = useMemo(
    () => signature.connect(state, send, normalizeProps),
    [state, send],
  )

  return (
    <div {...api.getRootProps()}>
      <div className="space-y-2">
        <label {...api.getLabelProps()}>
          Signature
        </label>
        <p className="text-sm text-muted-foreground mt-0!">
          Draw your signature in the area below
        </p>
      </div>

      <div {...api.getControlProps()}>
        <svg {...api.getSegmentProps()}>
          {api.paths.map((path, i) => (
            <path
              key={i}
              {...api.getSegmentPathProps({ path })}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {api.currentPath && (
            <path
              {...api.getSegmentPathProps({ path: api.currentPath })}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        <button {...api.getClearTriggerProps()}>
          <span></span>
          <span>Clear signature</span>
        </button>
        <div {...api.getGuideProps()}>
          Sign above
        </div>
      </div>
      <div className="flex items-center justify-between mt-0!">
        <p className="text-xs text-muted-foreground mt-0!">
          {api.paths.length}
          {' '}
          stroke
          {api.paths.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  )
}
