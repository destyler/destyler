import { normalizeProps, useMachine } from '@destyler/react'
import * as signature from '@destyler/signature'
import { useId, useMemo } from 'react'

export default function Signature() {

  const [state, send] = useMachine(signature.machine({ id: useId() }))

  const api = useMemo(
    () => signature.connect(state, send, normalizeProps),
    [state, send],
  )

  return (
    <div {...api.getRootProps()} className="signature-container">
      <div className="signature-header">
        <label 
          {...api.getLabelProps()} 
          className="signature-label"
        >
          Signature
        </label>
        <p className="signature-description">
          Draw your signature in the area below
        </p>
      </div>

      <div
        {...api.getControlProps()}
        className="signature-control"
      >
        <svg 
          {...api.getSegmentProps()} 
          className="signature-canvas"
        >
          {api.paths.map((path, i) => (
            <path
              key={i}
              {...api.getSegmentPathProps({ path })}
              className="signature-path"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {api.currentPath && (
            <path
              {...api.getSegmentPathProps({ path: api.currentPath })}
              className="signature-path"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        <button
          {...api.getClearTriggerProps()}
          className="signature-clear-button"
        >
          <span className="signature-clear-icon i-lucide:x"></span>
          <span className="signature-sr-only">Clear signature</span>
        </button>
        <div
          {...api.getGuideProps()}
          className="signature-guide"
        >
          Sign above
        </div>
      </div>
      <div className="signature-footer">
        <p className="signature-counter">
          {api.paths.length} stroke{api.paths.length !== 1 ? 's' : ''}
        </p>
        <div className="signature-actions">
          <button
            {...api.getClearTriggerProps()}
            className="signature-clear-action"
          >
            <span className="signature-eraser-icon i-lucide:eraser"></span>
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
