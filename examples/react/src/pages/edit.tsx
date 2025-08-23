import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/react'
import { editControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/edit.css'

export default function EditPage() {
  const controls = useControls(editControls)

  const [state, send] = useMachine(edit.machine({
    id: useId(),
    value: 'Hello World',
    placeholder: 'Type something...',
  }), {
    context: controls.context,
  })

  const api = edit.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="edit-root">
        <div {...api.getAreaProps()} className="edit-area">
          <input
            data-testid="input"
            {...api.getInputProps()}
            className="edit-input"
          />
          <span
            data-testid="preview"
            {...api.getPreviewProps()}
            className="edit-preview"
          />
        </div>
        <div className="edit-actions-box space-x-2">
          {api.editing
            ? (
                <div className="space-x-2">
                  <button
                    data-testid="save:trigger"
                    {...api.getSubmitTriggerProps()}
                  >
                    Save
                  </button>
                  <button
                    data-testid="cancel:trigger"
                    {...api.getCancelTriggerProps()}
                  >
                    Cancel
                  </button>
                </div>
              )
            : (
                <button
                  data-testid="edit:trigger"
                  {...api.getEditTriggerProps()}
                >
                  Edit
                </button>
              )}
        </div>
      </div>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
