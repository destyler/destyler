import * as edit from '@destyler/edit'
import { normalizeProps, useMachine } from '@destyler/react'
import { editControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'

export default function EditPage() {
  const controls = useControls(editControls)

  const [state, send] = useMachine(edit.machine({
    id: useId(),
    placeholder: 'Type something...',
  }), {
    context: controls.context,
  })

  const api = edit.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div {...api.getAreaProps()} className="mb-4">
          <input
            {...api.getInputProps()}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
          <span
            {...api.getPreviewProps()}
            className="block mt-2 text-gray-700"
          />
        </div>
        <div className="flex justify-end space-x-2">
          {api.editing
            ? (
                <div className="space-x-2">
                  <button
                    {...api.getSubmitTriggerProps()}
                    className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                  >
                    Save
                  </button>
                  <button
                    {...api.getCancelTriggerProps()}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                </div>
              )
            : (
                <button
                  {...api.getEditTriggerProps()}
                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
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
