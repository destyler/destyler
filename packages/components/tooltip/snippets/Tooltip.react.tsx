import { normalizeProps, useMachine } from '@destyler/react'
import * as tooltip from '@destyler/tooltip'
import { useId } from 'react'
import './style.css'

export default function TooltipDemo() {
  const id = useId()
  const [state, send] = useMachine(tooltip.machine({ id }))
  const api = tooltip.connect(state, send, normalizeProps)

  return (
    <>
      <div className="flex items-center justify-center min-h-[200px] mt-0!">
        <button {...api.getTriggerProps()}>
          Hover me
        </button>
        <div {...api.getPositionerProps()}>
          <div {...api.getContentProps()}>
            This is a tooltip following the mouse cursor.
          </div>
        </div>
      </div>
    </>
  )
}
