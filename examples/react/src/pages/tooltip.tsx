import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import * as tooltip from '@destyler/tooltip'
import { useId } from 'react'
import '@destyler/shared-private/styles/tooltip.css'

export default function TooltipDemo() {
  const id = useId()
  const [state, send] = useMachine(tooltip.machine({ id }))
  const api = tooltip.connect(state, send, normalizeProps)

  return (
    <>
      <div className="tooltip-root">
        <button
          {...api.getTriggerProps()}
          className="tooltip-trigger"
        >
          Hover me
        </button>
        <div {...api.getPositionerProps()} className="tooltip-positioner">
          <div
            {...api.getContentProps()}
            className="tooltip-content"
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
