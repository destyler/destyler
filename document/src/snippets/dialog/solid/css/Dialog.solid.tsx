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
        class="dialog-trigger"
      >
        Open Dialog
      </button>

      { api().open && (
        <Portal mount={document.body}>
          <div>
            <div
              {...api().getBackdropProps()}
              class="dialog-backdrop"
            />
            <div
              {...api().getPositionerProps()}
              class="dialog-positioner"
            >
              <div
                {...api().getContentProps()}
                class="dialog-content"
              >
                <h2
                  {...api().getTitleProps()}
                  class="dialog-title"
                >
                  Edit profile
                </h2>
                <p
                  {...api().getDescriptionProps()}
                  class="dialog-description"
                >
                  Make changes to your profile here. Click save when you are done.
                </p>
                <button
                  {...api().getCloseTriggerProps()}
                  class="dialog-close-trigger"
                >
                  <div class="i-carbon:close-large" />
                </button>
                <input
                  placeholder="Enter name..."
                  class="dialog-input"
                />
                <button class="dialog-action">
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
