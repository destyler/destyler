import * as popover from '@destyler/popover'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function Popover() {

  const buttonRef = useRef(null)

  const [state, send] = useMachine(popover.machine({
    id: useId(),
    initialFocusEl: ()=> buttonRef.current
  }))

  const api = popover.connect(state, send, normalizeProps)

  return (
    <div className=" mt-0!">
      <button
        {...api.getTriggerProps()}
        className="btn "
      >
        Open popover
      </button>

      {api.open && createPortal(
        <div {...api.getPositionerProps()} className="z-50">
          <div
            {...api.getContentProps()}
            className="z-50 w-72 rounded-md border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none"
          >
            <div
              {...api.getTitleProps()}
              className="text-sm font-medium mb-2"
            >
              Presenters
            </div>

            <div
              {...api.getDescriptionProps()}
              className="text-sm text-muted-foreground mb-4"
            >
              Description
            </div>

            <button ref={buttonRef} className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-9 px-4 py-2">
              Action Button
            </button>

            <button
              {...api.getCloseTriggerProps()}
              className="absolute top-3.5 right-3.5 bg-muted-foreground/70! hover:bg-muted-foreground i-carbon:close-large rounded-sm opacity-70 transition-opacity hover:opacity-100"
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
