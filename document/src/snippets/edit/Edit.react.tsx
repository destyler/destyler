import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '../../styles/components/edit.css'

export default function EditPage() {
  const [state, send] = useMachine(edit.machine({
    id: useId(),
    placeholder: 'Type something...',
  }))

  const api = edit.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()}>
        <div {...api.getAreaProps()}>
          <input {...api.getInputProps()} />
          <span {...api.getPreviewProps()} />
        </div>
        <div className="flex justify-end gap-2 mt-0!">
          {api.editing
            ? (
                <>
                  <button {...api.getSubmitTriggerProps()}>
                    Save
                  </button>
                  <button {...api.getCancelTriggerProps()}>
                    Cancel
                  </button>
                </>
              )
            : (
                <button {...api.getEditTriggerProps()}>
                  Edit
                </button>
              )}
        </div>
      </div>
    </>
  )
}
