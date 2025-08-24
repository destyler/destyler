import { normalizeProps, useMachine } from '@destyler/react'
import * as tooltip from '@destyler/tooltip'
import { useId } from 'react'

export default function TooltipDemo() {
  const id = useId()
  const [state, send] = useMachine(tooltip.machine({ id }))
  const api = tooltip.connect(state, send, normalizeProps)

  return (
    <>
      <div className="flex items-center justify-center min-h-[200px] mt-0!">
        <button
          {...api.getTriggerProps()}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Hover me
        </button>
        <div {...api.getPositionerProps()} className="z-50 mt-0!">
          <div
            {...api.getContentProps()}
            className={`z-50 overflow-hidden rounded-md border bg-popover px-3 
            py-1.5 text-sm text-popover-foreground shadow-md animate-in 
            fade-in-0 zoom-in-95 data-[state=closed]:animate-out mt-0!
            data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 
            data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 
            data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2`}
          >
            This is a tooltip following the mouse cursor.
          </div>
        </div>
      </div>
    </>
  )
}
