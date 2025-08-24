/** @jsxImportSource solid-js */
import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Edit() {

  const [state, send] = useMachine(edit.machine({
    id: createUniqueId(),
    placeholder: 'Type something...',
  }))

  const api = createMemo(() => edit.connect(state, send, normalizeProps))

  return (
    <>
      <div
        {...api().getRootProps()}
        class="edit-root"
      >
        <div {...api().getAreaProps()} class="edit-area">
          <input
            {...api().getInputProps()}
            class="edit-input"
          />
          <span
            {...api().getPreviewProps()}
            class="edit-preview"
          />
        </div>
        <div class="edit-actions">
          {api().editing
            ? (
                <div>
                  <button
                    {...api().getSubmitTriggerProps()}
                    class="edit-button-primary"
                  >
                    Save
                  </button>
                  <button
                    {...api().getCancelTriggerProps()}
                    class="edit-button-secondary"
                  >
                    Cancel
                  </button>
                </div>
              )
            : (
                <button
                  {...api().getEditTriggerProps()}
                  class="edit-button-primary"
                >
                  Edit
                </button>
              )}
        </div>
      </div>
    </>
  )
}
