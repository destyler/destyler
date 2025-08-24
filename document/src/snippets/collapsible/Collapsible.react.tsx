import * as collapsible from '@destyler/collapsible'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './collapsible.css'

export default function Collapsible() {
  const [state, send] = useMachine(collapsible.machine({ id: useId() }))
  const api = collapsible.connect(state, send, normalizeProps)

  return (
    <div
      className="w-[350px] max-w-sm my-8"
      {...api.getRootProps()}
    >
      <div className="flex items-center justify-between space-x-4 px-4">
        <h4 className="text-sm! font-semibold">
          @elonehoo starred 3 repositories
        </h4>
        <button
          className="group m-0! size-6! hover:bg-background p-1 rounded-md flex justify-center items-center"
          {...api.getTriggerProps()}
        >
          <div
            className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 i-carbon:chevron-down"
          />
        </button>
      </div>

      <div className="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm">
        @destyler/collapsible
      </div>

      <div
        className="overflow-hidden rounded-b-md content"
        {...api.getContentProps()}
      >
        <div className="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm">
          @destyler/react
        </div>
        <div className="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm">
          react
        </div>
      </div>
    </div>
  )
}
