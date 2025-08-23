import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/react'
import { dialogControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/dialog.css'

export default function DialogExample() {
  const controls = useControls(dialogControls)

  const [state, send] = useMachine(dialog.machine({
    id: useId(),
  }), {
    context: controls.context,
  })

  const api = dialog.connect(state, send, normalizeProps)

  return (
    <>
      <button
        {...api.getTriggerProps()}
        className="dialog-trigger"
      >
        Open Dialog
      </button>
      <div>
        <div
          {...api.getBackdropProps()}
          className="dialog-backdrop"
        />
        <div
          {...api.getPositionerProps()}
          className="dialog-positioner"
        >
          <div
            {...api.getContentProps()}
            className="dialog-content"
          >
            <h2
              {...api.getTitleProps()}
              className="dialog-title"
            >
              Edit profile
            </h2>
            <p
              {...api.getDescriptionProps()}
              className="dialog-description"
            >
              Make changes to your profile here. Click save when you are done.
            </p>
            <button
              {...api.getCloseTriggerProps()}
              className="dialog-close-trigger"
            >
              <div className="dialog-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z" /></svg>
              </div>
            </button>
            <input
              placeholder="Enter name..."
              className="dialog-input"
            />
            <button>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
