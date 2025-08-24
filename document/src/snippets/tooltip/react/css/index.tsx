import { normalizeProps, useMachine } from '@destyler/react'
import * as tooltip from '@destyler/tooltip'
import { useId } from 'react'

export default function TooltipDemo() {
  const id = useId()
  const [state, send] = useMachine(tooltip.machine({ id }))
  const api = tooltip.connect(state, send, normalizeProps)

  return (
    <>
      <div className="tooltip-container">
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
            This is a tooltip following the mouse cursor.
          </div>
        </div>
      </div>
    </>
  )
}
