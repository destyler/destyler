import '@destyler/shared-private/styles/tooltip.css'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tooltip from '@destyler/tooltip'
import { createMemo, createUniqueId } from 'solid-js'

export default function TooltipDemo() {
  const id = createUniqueId()
  const [state, send] = useMachine(tooltip.machine({ id }))
  const api = createMemo(() => tooltip.connect(state, send, normalizeProps))

  return (
    <>
      <div class="tooltip-root">
        <button
          {...api().getTriggerProps()}
          class="tooltip-trigger"
        >
          Hover me
        </button>
        <div {...api().getPositionerProps()} class="tooltip-positioner">
          <div
            {...api().getContentProps()}
            class="tooltip-content"
          >
            Tooltip
          </div>
        </div>
      </div>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
