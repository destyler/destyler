/** @jsxImportSource solid-js */
import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@docs/styles/components/collapsible.css'

export default function Collapsible() {
  const [state, send] = useMachine(collapsible.machine({ id: createUniqueId() }))
  const api = createMemo(() => collapsible.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <div>
        <h4>@elonehoo starred 3 repositories</h4>
        <button {...api().getTriggerProps()}>
          <div />
        </button>
      </div>

      <div>@destyler/collapsible</div>

      <div {...api().getContentProps()}>
        <div>@destyler/solid</div>
        <div>solid-js</div>
      </div>
    </div>
  )
}
