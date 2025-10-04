import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './style.css'

export default function Collapsible() {
  const [state, send] = useMachine(collapsible.machine({ id: useId() }))
  const api = collapsible.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <div>
        <h4>@elonehoo starred 3 repositories</h4>
        <button {...api.getTriggerProps()}>
          <div />
        </button>
      </div>

      <div>@destyler/collapsible</div>

      <div {...api.getContentProps()}>
        <div>@destyler/react</div>
        <div>react</div>
      </div>
    </div>
  )
}
