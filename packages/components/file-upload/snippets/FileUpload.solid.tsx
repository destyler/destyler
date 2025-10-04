/** @jsxImportSource solid-js */
import * as fileUpload from '@destyler/file-upload'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import './style.css'

export default function FileUpload() {
  const [state, send] = useMachine(fileUpload.machine({ id: createUniqueId() }))

  const api = createMemo(() => fileUpload.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <div {...api().getDropzoneProps()}>
        <input {...api().getHiddenInputProps()} />
        <div class="flex flex-col items-center text-center mt-0!">
          <div class="mb-3 rounded-full p-2 mt-0!">
            <div class="i-lucide-upload w-6 h-6 text-primary mt-0!"></div>
          </div>
          <p class="text-sm font-medium text-accent-foreground mt-0!">Drag and drop files here</p>
          <p class="text-xs text-accent-foreground/50 mt-0!">or</p>
        </div>
        <button {...api().getTriggerProps()}>
          Choose Files
        </button>
      </div>

      <ul {...api().getItemGroupProps()}>
        <For each={api().acceptedFiles}>
          {file => (
            <li {...api().getItemProps({ file })}>
              <div class="flex items-center space-x-3">
                <div class="p-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-md">
                  <div class="i-lucide-file-text w-4 h-4 text-zinc-500 dark:text-zinc-400"></div>
                </div>
                <div {...api().getItemNameProps({ file })}>
                  {file.name}
                </div>
              </div>
              <button {...api().getItemDeleteTriggerProps({ file })}>
                <div></div>
              </button>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}
