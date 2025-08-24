/** @jsxImportSource solid-js */
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'

export default function Dialog() {
  const [state, send] = useMachine(dialog.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => dialog.connect(state, send, normalizeProps))

  return (
    <>
      <button
        {...api().getTriggerProps()}
        class={`focus:outline-none disabled:cursor-not-allowed disabled:opacity-75 flex-shrink-0 
        font-medium rounded-md text-sm gap-x-2.5 px-3.5 py-2.5 shadow-sm text-primary-foreground! 
        bg-primary! hover:bg-primary/90! focus-visible:outline-2 focus-visible:outline-offset-2 
        focus-visible:outline-light-500 group-data-[theme=dark]:focus-visible:outline-light-400 
        inline-flex items-center`}
      >
        Open Dialog
      </button>

      { api().open && (
        <Portal mount={document.body}>
          <div>
            <div
              {...api().getBackdropProps()}
              class="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm"
            />
            <div
              {...api().getPositionerProps()}
              class="fixed z-101 inset-0 flex items-center justify-center"
            >
              <div
                {...api().getContentProps()}
                class="bg-background border border-border! shadow-lg rounded-lg w-full max-w-md relative p-6"
              >
                <h2
                  {...api().getTitleProps()}
                  class="text-lg font-semibold text-foreground mb-4"
                >
                  Edit profile
                </h2>
                <p
                  {...api().getDescriptionProps()}
                  class="text-muted-foreground mb-6"
                >
                  Make changes to your profile here. Click save when you are done.
                </p>
                <button
                  {...api().getCloseTriggerProps()}
                  class="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100"
                >
                  <div class="w-4 h-4 i-carbon:close-large" />
                </button>
                <input
                  placeholder="Enter name..."
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button class="btn mt-4 w-full justify-center">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  )
}
