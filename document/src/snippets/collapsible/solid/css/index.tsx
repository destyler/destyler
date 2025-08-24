/** @jsxImportSource solid-js */
import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Collapsible() {
  const [state, send] = useMachine(collapsible.machine({ id: createUniqueId() }))
  const api = createMemo(() => collapsible.connect(state, send, normalizeProps))

  return (
    <div
      {...api().getRootProps()}
      class="collapsible-root"
    >
      <div class="collapsible-header">
        <h4 class="collapsible-title">
          @elonehoo starred 3 repositories
        </h4>
        <button
          class="collapsible-trigger"
          {...api().getTriggerProps()}
        >
          <div class="collapsible-trigger-icon" />
        </button>
      </div>

      <div class="collapsible-main-item">
        @destyler/collapsible
      </div>

      <div
        class="collapsible-content"
        {...api().getContentProps()}
      >
        <div class="collapsible-content-item">
          @destyler/solid
        </div>
        <div class="collapsible-content-item">
          solid-js
        </div>
      </div>
    </div>
  )
}
