import * as floatingPanel from '@destyler/floating-panel'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function FloatingPanel() {
  const [state, send] = useMachine(floatingPanel.machine({
    id: useId(),
    closeOnEscape: true,
  }))

  const api = floatingPanel.connect(state, send, normalizeProps)

  return (
    <main className="floating-panel mt-0!">
      <div className="flex items-center justify-center">
        <button
          {...api.getTriggerProps()}
          className="btn"
        >
          Click
        </button>
        <div {...api.getPositionerProps()}>
          <div
            {...api.getContentProps()}
            className="fixed rounded-lg border border-border bg-card text-card-foreground shadow-lg min-w-[320px] min-h-[150px]"
          >
            <div {...api.getDragTriggerProps()} className="cursor-move">
              <div
                {...api.getHeaderProps()}
                className="flex h-10 items-center justify-between border-b border-border px-4 py-2"
              >
                <p {...api.getTitleProps()} className="text-sm font-medium mt-0!">
                  title
                </p>
                <div data-scope="floating-panel" data-part="trigger-group" className="flex mt-0! items-center gap-1">
                  <button
                    {...api.getCloseTriggerProps()}
                    className="inline-flex mt-0! items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0"
                  >
                    <div className="w-4 h-4 i-carbon:close-large" />
                  </button>
                </div>
              </div>
            </div>
            <div {...api.getBodyProps()} className="p-6 mt-0!">
              <p className="text-sm text-muted-foreground mt-0!">
                floating panel content
              </p>
            </div>

            <div {...api.getResizeTriggerProps({ axis: 'n' })} className="absolute mt-0! top-0 left-0 right-0 h-1 cursor-ns-resize bg-transparent" />
            <div {...api.getResizeTriggerProps({ axis: 'e' })} className="absolute top-0 right-0 bottom-0 w-1 cursor-ew-resize bg-transparent" />
            <div {...api.getResizeTriggerProps({ axis: 'w' })} className="absolute top-0 left-0 bottom-0 w-1 cursor-ew-resize bg-transparent" />
            <div {...api.getResizeTriggerProps({ axis: 's' })} className="absolute bottom-0 left-0 right-0 h-1 cursor-ns-resize bg-transparent" />
            <div {...api.getResizeTriggerProps({ axis: 'ne' })} className="absolute top-0 right-0 w-2 h-2 cursor-ne-resize bg-transparent" />
            <div {...api.getResizeTriggerProps({ axis: 'se' })} className="absolute bottom-0 right-0 w-2 h-2 cursor-se-resize bg-transparent" />
            <div {...api.getResizeTriggerProps({ axis: 'sw' })} className="absolute bottom-0 left-0 w-2 h-2 cursor-sw-resize bg-transparent" />
            <div {...api.getResizeTriggerProps({ axis: 'nw' })} className="absolute top-0 left-0 w-2 h-2 cursor-nw-resize bg-transparent" />
          </div>
        </div>
      </div>
    </main>
  )
}
