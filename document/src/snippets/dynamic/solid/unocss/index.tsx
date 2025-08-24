/** @jsxImportSource solid-js */
import * as dynamic from '@destyler/dynamic'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'

export default function DynamicPage() {
  const [state, send] = useMachine(
    dynamic.machine({
      id: createUniqueId(),
      value: ['Solid', 'Vue'],
    }),
  )

  const api = createMemo(() => dynamic.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="w-md p-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <For each={api().value}>
            {(value, index) => (
              <span
                {...api().getItemProps({ index: index(), value })}
                class="relative group"
              >
                <div
                  {...api().getItemPreviewProps({ index: index(), value })}
                  class="bg-secondary text-secondary-foreground rounded-md px-3 py-1.5 flex items-center gap-2 shadow-sm border border-px border-input"
                >
                  <span class="text-sm font-medium">{value}</span>
                  <button
                    {...api().getItemDeleteTriggerProps({ index: index(), value })}
                    class="i-carbon:close inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary/50 hover:bg-primary transition-colors text-xs"
                  />
                </div>
                <input
                  {...api().getItemInputProps({ index: index(), value })}
                  class="hidden absolute left-0 top-0 w-full px-2 py-1.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-transparent outline-none bg-background text-foreground"
                />
              </span>
            )}
          </For>
        </div>
        <div class="relative">
          <input
            placeholder="Add tag..."
            {...api().getInputProps()}
            class="w-full px-4 py-2.5 border border-input rounded-md focus:ring-2 focus:ring-ring focus:border-primary outline-none bg-background text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>
    </>
  )
}
