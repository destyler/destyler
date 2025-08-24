import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function FileUpload() {

  const [state, send] = useMachine(fileUpload.machine({ id: useId() }))

  const api = fileUpload.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()} className="w-full min-w-md mx-auto">
      <div
        {...api.getDropzoneProps()}
        className="mt-0! flex flex-col items-center justify-center border border-dashed 
        border-border rounded-md p-8 transition-colors cursor-pointer bg-background 
        hover:border-primary/50 data-[dragging]:bg-popover/50"
      >
        <input {...api.getHiddenInputProps()} />
        <div className="flex flex-col items-center text-center mt-0!">
          <div className="mb-3 rounded-full p-2 mt-0!">
            <div className="i-lucide-upload w-6 h-6 text-primary mt-0!"></div>
          </div>
          <p className="text-sm font-medium text-accent-foreground mt-0!">Drag and drop files here</p>
          <p className="text-xs text-accent-foreground/50 mt-0!">or</p>
        </div>
        <button
          {...api.getTriggerProps()}
          className="mt-2! text-sm font-medium h-9 px-4 py-2 bg-primary
          text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Choose Files
        </button>
      </div>

      <ul
        {...api.getItemGroupProps()}
        className="mt-4! ml-0!"
      >
        {api.acceptedFiles.map(file => (
          <li
            key={file.name}
            {...api.getItemProps({ file })}
            className="mt-0! flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div className="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                <div className="i-lucide-file-text w-4 h-4 text-zinc-500 dark:text-zinc-400"></div>
              </div>
              <div
                {...api.getItemNameProps({ file })}
                className="mt-0! text-sm text-zinc-900 dark:text-zinc-50 truncate max-w-[400px]"
              >
                {file.name}
              </div>
            </div>
            <button
              {...api.getItemDeleteTriggerProps({ file })}
              className="flex items-center justify-center w-6 h-6 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <div className="i-lucide-x w-4 h-4"></div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
