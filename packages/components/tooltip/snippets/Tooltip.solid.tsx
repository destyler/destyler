/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tooltip from '@destyler/tooltip'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

export default function TooltipDemo() {
  const id = createUniqueId()
  const [state, send] = useMachine(tooltip.machine({
    id,
  }))
  const api = createMemo(() => tooltip.connect(state, send, normalizeProps))

  return (
    <>
      <div class="flex items-center justify-center min-h-[200px] mt-0!">
        <button {...api().getTriggerProps()}>
          Hover me
        </button>
        <div {...api().getPositionerProps()}>
          <div {...api().getContentProps()}>
            This is a tooltip following the mouse cursor.
          </div>
        </div>
      </div>
    </>
  )
}
