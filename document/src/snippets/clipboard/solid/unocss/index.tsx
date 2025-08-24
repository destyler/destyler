/** @jsxImportSource solid-js */
import * as clipboard from '@destyler/clipboard'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function Clipboard() {

  const [state, send] = useMachine(
    clipboard.machine({
      id: createUniqueId(),
      value: 'https://github.com/destyler/destyler',
    })
  )

  const api = createMemo(() => clipboard.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="max-w-md p-6">
        <label {...api().getLabelProps()} class="block text-sm font-medium text-primary/70 mb-2">
          Copy Link
        </label>
        <div {...api().getControlProps()} class="flex items-center gap-2 mt-1!">
          <div class="relative flex-1">
            <input
              {...api().getInputProps()}
              class={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base 
              shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium 
              file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none 
              focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 
              md:text-sm text-primary/90!`}
              readOnly
            />
          </div>
          <button
            {...api().getTriggerProps()}
            class={`mt-0! inline-flex items-center justify-center size-8 rounded-lg transition-all duration-200 bg-primary `}
          >
            {api().copied
              ? (
                  <div class="transform transition-transform duration-200 i-carbon:checkmark size-4" />
                )
              : (
                  <div class="i-carbon:copy size-4" />
                )}
          </button>
        </div>
      </div>
    </>
  )
}
