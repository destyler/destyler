import { normalizeProps, useMachine } from '@destyler/react'
import * as signature from '@destyler/signature'
import { useId, useMemo } from 'react'

export default function Signature() {

  const [state, send] = useMachine(signature.machine({ id: useId() }))

  const api = useMemo(
    () => signature.connect(state, send, normalizeProps),
    [state, send],
  )

  return (
    <div {...api.getRootProps()} className="w-full min-w-md space-y-4">
      <div className="space-y-2">
        <label 
          {...api.getLabelProps()} 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary"
        >
          Signature
        </label>
        <p className="text-sm text-muted-foreground mt-0!">
          Draw your signature in the area below
        </p>
      </div>

      <div
        {...api.getControlProps()}
        className="relative w-full h-48 rounded-md border border-input bg-background p-3 shadow-sm focus-within:ring-1 focus-within:ring-ring"
      >
        <svg 
          {...api.getSegmentProps()} 
          className="h-full w-full rounded-sm"
        >
          {api.paths.map((path, i) => (
            <path
              key={i}
              {...api.getSegmentPathProps({ path })}
              className="stroke-foreground"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
          {api.currentPath && (
            <path
              {...api.getSegmentPathProps({ path: api.currentPath })}
              className="stroke-foreground"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
        </svg>
        <button
          {...api.getClearTriggerProps()}
          className="absolute right-2 top-2 mt-0! inline-flex h-8 w-8 items-center justify-center rounded-sm border border-input bg-background text-sm shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="h-4 w-4 i-lucide:x text-muted-foreground"></span>
          <span className="sr-only">Clear signature</span>
        </button>
        <div
          {...api.getGuideProps()}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-muted-foreground mt-0!"
        >
          Sign above
        </div>
      </div>
      <div className="flex items-center justify-between mt-0!">
        <p className="text-xs text-muted-foreground mt-0!">
          {api.paths.length} stroke{api.paths.length !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-2 mt-0!">
          <button
            {...api.getClearTriggerProps()}
            className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-xs shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-muted-foreground"
          >
            <span className="mr-1 h-3 w-3 i-lucide:eraser"></span>
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
