import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

export default function Collapsible() {
  const [state, send] = useMachine(collapsible.machine({ id: useId() }))
  const api = collapsible.connect(state, send, normalizeProps)

  return (
    <div
      {...api.getRootProps()}
      className="collapsible-root"
    >
      <div className="collapsible-header">
        <h4 className="collapsible-title">
          @elonehoo starred 3 repositories
        </h4>
        <button
          className="collapsible-trigger"
          {...api.getTriggerProps()}
        >
          <div className="collapsible-trigger-icon" />
        </button>
      </div>

      <div className="collapsible-main-item">
        @destyler/collapsible
      </div>

      <div
        className="collapsible-content"
        {...api.getContentProps()}
      >
        <div className="collapsible-content-item">
          @destyler/react
        </div>
        <div className="collapsible-content-item">
          react
        </div>
      </div>
    </div>
  )
}
