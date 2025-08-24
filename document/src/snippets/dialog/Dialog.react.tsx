import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'

export default function Dialog() {
  const [state, send] = useMachine(dialog.machine({
    id: useId(),
  }))

  const api = dialog.connect(state, send, normalizeProps)

  return (
    <>
      <button
        {...api.getTriggerProps()}
        className="btn"
      >
        Open Dialog
      </button>

      {api.open && createPortal(
        <div>
          <div
            {...api.getBackdropProps()}
            className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm"
          />
          <div
            {...api.getPositionerProps()}
            className="fixed z-101 inset-0 flex items-center justify-center"
          >
            <div
              {...api.getContentProps()}
              className="bg-background border border-border! shadow-lg rounded-lg w-full max-w-md relative p-6"
            >
              <h2
                {...api.getTitleProps()}
                className="text-lg font-semibold text-foreground mb-4"
              >
                Edit profile
              </h2>
              <p
                {...api.getDescriptionProps()}
                className="text-muted-foreground mb-6"
              >
                Make changes to your profile here. Click save when you are done.
              </p>
              <button
                {...api.getCloseTriggerProps()}
                className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
              >
                <div className="w-4 h-4 i-carbon:close-large" />
              </button>
              <input
                placeholder="Enter name..."
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button className="btn mt-4 w-full justify-center">
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
