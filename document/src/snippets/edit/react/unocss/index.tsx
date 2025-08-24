import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function EditPage() {

  const [state, send] = useMachine(edit.machine({
    id: useId(),
    placeholder: 'Type something...',
  }))

  const api = edit.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md p-6">
        <div {...api.getAreaProps()} className="mb-4">
          <input
            {...api.getInputProps()}
            className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <span
            {...api.getPreviewProps()}
            className="block mt-2 text-muted-foreground text-sm"
          />
        </div>
        <div className="flex justify-end gap-2 mt-0!">
          {api.editing
            ? (
                <>
                  <button
                    {...api.getSubmitTriggerProps()}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Save
                  </button>
                  <button
                    {...api.getCancelTriggerProps()}
                    className="mt-0! inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    Cancel
                  </button>
                </>
              )
            : (
                <button
                  {...api.getEditTriggerProps()}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Edit
                </button>
              )}
        </div>
      </div>
    </>
  )
}
