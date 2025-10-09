import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import './style.css'

export default function Popover() {
  const buttonRef = useRef(null)

  const [state, send] = useMachine(popover.machine({
    id: useId(),
    initialFocusEl: () => buttonRef.current,
  }))

  const api = popover.connect(state, send, normalizeProps)

  return (
    <div className=" mt-0!" data-layout="sinppets">
      <button {...api.getTriggerProps()}>
        Open popover
      </button>

      {api.open && createPortal(
        <div {...api.getPositionerProps()} data-layout="sinppets">
          <div {...api.getContentProps()}>
            <div {...api.getTitleProps()}>
              Presenters
            </div>

            <div {...api.getDescriptionProps()}>
              Description
            </div>

            <button ref={buttonRef} className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2">
              Action Button
            </button>

            <button {...api.getCloseTriggerProps()} />
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
