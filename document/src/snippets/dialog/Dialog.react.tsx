import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { createPortal } from 'react-dom'
import '../../styles/components/dialog.css'

export default function Dialog() {
  const [state, send] = useMachine(dialog.machine({
    id: useId(),
  }))

  const api = dialog.connect(state, send, normalizeProps)

  return (
    <>
      <button {...api.getTriggerProps()}>
        Open Dialog
      </button>

      {api.open && createPortal(
        <div data-layout="sinppets">
          <div {...api.getBackdropProps()} />
          <div {...api.getPositionerProps()}>
            <div {...api.getContentProps()}>
              <h2 {...api.getTitleProps()}>
                Edit profile
              </h2>
              <p {...api.getDescriptionProps()}>
                Make changes to your profile here. Click save when you are done.
              </p>
              <button {...api.getCloseTriggerProps()}>
                <div />
              </button>
              <input placeholder="Enter name..." />
              <button>
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
