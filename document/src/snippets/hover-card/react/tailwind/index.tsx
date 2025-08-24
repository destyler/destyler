import * as hoverCard from '@destyler/hover-card'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'

export default function HoverCard() {
  const [state, send] = useMachine(hoverCard.machine({
    id: useId(),
  }))

  const api = hoverCard.connect(state, send, normalizeProps)

  return (
    <div className=" mt-0!">
      <a
        href="https://twitter.com/elonehoo"
        target="_blank"
        {...api.getTriggerProps()}
        className="focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 
        font-medium rounded-md text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm text-primary-foreground! 
        bg-primary! hover:bg-primary/90! focus-visible:outline-2 focus-visible:outline-offset-2 
        focus-visible:outline-light-500 group-data-[theme=dark]:focus-visible:outline-light-400 
        inline-flex items-center no-underline!"
      >
        Hover
      </a>

      {api.open && createPortal(
        <div {...api.getPositionerProps()}>
          <div
            {...api.getContentProps()}
            className="z-50 w-64 rounded-md border border-border! bg-popover p-4 text-popover-foreground shadow-md outline-none animate-in zoom-in-90"
          >
            <div className="flex gap-4 mt-0!">
              <img
                src="https://github.com/elonehoo.png"
                alt="Profile"
                className="h-12 w-12 rounded-full border border-border!"
              />
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">elonehoo</h4>
                <p className="text-sm text-muted-foreground">Frontend Developer</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              I hope every sunny afternoon can be wasted.
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <div className="w-4 h-4 i-carbon:logo-x mr-2" />
              @elonehoo
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  )
}
