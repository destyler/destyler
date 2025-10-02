/** @jsxImportSource solid-js */
import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@docs/styles/components/edit.css'

export default function Edit() {
  const [state, send] = useMachine(edit.machine({
    id: createUniqueId(),
    placeholder: 'Type something...',
  }))

  const api = createMemo(() => edit.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()}>
        <div {...api().getAreaProps()}>
          <input {...api().getInputProps()} />
          <span {...api().getPreviewProps()} />
        </div>
        <div class="flex justify-end gap-2 mt-0!">
          {api().editing
            ? (
                <div class="space-x-2">
                  <button {...api().getSubmitTriggerProps()}>
                    Save
                  </button>
                  <button {...api().getCancelTriggerProps()}>
                    Cancel
                  </button>
                </div>
              )
            : (
                <button {...api().getEditTriggerProps()}>
                  Edit
                </button>
              )}
        </div>
      </div>
    </>
  )
}
