/** @jsxImportSource solid-js */
import * as edit from '@destyler/edit'
import { editControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/edit.css'

export default function EditPage() {
  const controls = useControls(editControls)

  const [state, send] = useMachine(edit.machine({
    id: createUniqueId(),
    value: 'Hello World',
    placeholder: 'Type something...',
  }), {
    context: controls.context,
  })

  const api = createMemo(() => edit.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="edit-root">
        <div {...api().getAreaProps()} class="edit-area">
          <input
            data-testid="input"
            {...api().getInputProps()}
            class="edit-input"
          />
          <span
            data-testid="preview"
            {...api().getPreviewProps()}
            class="edit-preview"
          />
        </div>
        <div class="edit-actions-box space-x-2">
          {api().editing
            ? (
                <div class="space-x-2">
                  <button
                    data-testid="save:trigger"
                    {...api().getSubmitTriggerProps()}
                  >
                    Save
                  </button>
                  <button
                    data-testid="cancel:trigger"
                    {...api().getCancelTriggerProps()}
                  >
                    Cancel
                  </button>
                </div>
              )
            : (
                <button
                  data-testid="edit:trigger"
                  {...api().getEditTriggerProps()}
                >
                  Edit
                </button>
              )}
        </div>
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
