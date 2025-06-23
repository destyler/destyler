import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/react'
import { fileUploadControls } from '@destyler/shared-private'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'
import { useControls } from '../hooks/use-controls'

export default function FileUpload() {
  const controls = useControls(fileUploadControls)

  const [state, send] = useMachine(fileUpload.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = fileUpload.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="max-w-2xl p-6">
      <div
        {...api.getDropzoneProps()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-800 transition-colors cursor-pointer bg-gray-50 data-[dragging]:bg-gray-100"
      >
        <input {...api.getHiddenInputProps()} />
        <p className="text-gray-600">Drag and drop your files here</p>
        <p className="text-sm text-gray-400 mt-2">or</p>
        <button
          {...api.getTriggerProps()}
          className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-md hover:bg-black transition-colors"
        >
          Choose Files...
        </button>
      </div>

      <ul
        {...api.getItemGroupProps()}
        className="mt-6 space-y-3"
      >
        {api.acceptedFiles.map(file => (
          <li
            key={file.name}
            {...api.getItemProps({ file })}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div
              {...api.getItemNameProps({ file })}
              className="text-gray-700 truncate"
            >
              {file.name}
            </div>
            <button
              {...api.getItemDeleteTriggerProps({ file })}
              className="ml-4 px-3 py-1 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </div>
  )
}
