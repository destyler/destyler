import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '../../styles/components/file-upload.css'

export default function FileUpload() {
  const [state, send] = useMachine(fileUpload.machine({ id: useId() }))

  const api = fileUpload.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <div {...api.getDropzoneProps()}>
        <input {...api.getHiddenInputProps()} />
        <div className="flex flex-col items-center text-center mt-0!">
          <div className="mb-3 rounded-full p-2 mt-0!">
            <div className="i-lucide-upload w-6 h-6 text-primary mt-0!"></div>
          </div>
          <p className="text-sm font-medium text-accent-foreground mt-0!">Drag and drop files here</p>
          <p className="text-xs text-accent-foreground/50 mt-0!">or</p>
        </div>
        <button {...api.getTriggerProps()}>
          Choose Files
        </button>
      </div>

      <ul {...api.getItemGroupProps()}>
        {api.acceptedFiles.map(file => (
          <li
            key={file.name}
            {...api.getItemProps({ file })}
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                <div className="i-lucide-file-text w-4 h-4 text-zinc-500 dark:text-zinc-400"></div>
              </div>
              <div {...api.getItemNameProps({ file })}>
                {file.name}
              </div>
            </div>
            <button {...api.getItemDeleteTriggerProps({ file })}>
              <div></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
