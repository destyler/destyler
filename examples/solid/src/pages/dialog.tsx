/** @jsxImportSource solid-js */
import * as dialog from '@destyler/dialog'
import { dialogControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/dialog.css'

export default function DialogExample() {
  const controls = useControls(dialogControls)

  const [state, send] = useMachine(dialog.machine({
    id: createUniqueId(),
  }), {
    context: controls.context,
  })

  const api = createMemo(() => dialog.connect(state, send, normalizeProps))

  return (
    <>
      <button
        {...api().getTriggerProps()}
        class="dialog-trigger"
      >
        Open Dialog
      </button>
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
              <div class="dialog-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg>
              </div>
            </button>
            <input
              placeholder="Enter name..."
              class="dialog-input"
            />
            <button>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
