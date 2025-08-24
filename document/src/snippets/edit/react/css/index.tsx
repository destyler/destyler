import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

export default function EditPage() {

  const [state, send] = useMachine(edit.machine({
    id: useId(),
    placeholder: 'Type something...',
  }))

  const api = edit.connect(state, send, normalizeProps)

  return (
    <>
      <div
        {...api.getRootProps()}
        className="edit-root"
      >
        <div {...api.getAreaProps()} className="edit-area">
          <input
            {...api.getInputProps()}
            className="edit-input"
          />
          <span
            {...api.getPreviewProps()}
            className="edit-preview"
          />
        </div>
        <div className="edit-actions">
          {api.editing
            ? (
                <>
                  <button
                    {...api.getSubmitTriggerProps()}
                    className="edit-button-primary"
                  >
                    Save
                  </button>
                  <button
                    {...api.getCancelTriggerProps()}
                    className="edit-button-secondary"
                  >
                    Cancel
                  </button>
                </>
              )
            : (
                <button
                  {...api.getEditTriggerProps()}
                  className="edit-button-primary"
                >
                  Edit
                </button>
              )}
        </div>
      </div>
    </>
  )
}
