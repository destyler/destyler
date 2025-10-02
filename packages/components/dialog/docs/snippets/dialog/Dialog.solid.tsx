/** @jsxImportSource solid-js */
import * as dialog from '@destyler/dialog'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import '@docs/styles/components/dialog.css'

export default function Dialog() {
  const [state, send] = useMachine(dialog.machine({
    id: createUniqueId(),
  }))

  const api = createMemo(() => dialog.connect(state, send, normalizeProps))

  return (
    <>
      <button {...api().getTriggerProps()}>
        Open Dialog
      </button>

      { api().open && (
        <Portal mount={document.body}>
          <div data-layout="sinppets">
            <div {...api().getBackdropProps()} />
            <div {...api().getPositionerProps()}>
              <div {...api().getContentProps()}>
                <h2 {...api().getTitleProps()}>
                  Edit profile
                </h2>
                <p {...api().getDescriptionProps()}>
                  Make changes to your profile here. Click save when you are done.
                </p>
                <button {...api().getCloseTriggerProps()}>
                  <div />
                </button>
                <input placeholder="Enter name..." />
                <button>
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
