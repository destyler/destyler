import * as dynamic from '@destyler/dynamic'
import { dynamicControls } from '@destyler/shared-private'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'

export default function DynamicPage() {
  const controls = useControls(dynamicControls)

  const [state, send] = useMachine(
    dynamic.machine({
      id: createUniqueId(),
      value: ['Solid', 'Vue'],
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => dynamic.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="max-w-md p-6">
        <div class="flex flex-wrap gap-2 mb-4">
          <For each={api().value}>
            {(value, index) => (
              <span
                {...api().getItemProps({ index: index(), value })}
                class="relative group"
              >
                <div
                  {...api().getItemPreviewProps({ index: index(), value })}
                  class="bg-gray-100 text-gray-900 rounded-lg px-3 py-1 flex items-center gap-2"
                >
                  <span class="text-sm font-medium">{value}</span>
                  <button
                    {...api().getItemDeleteTriggerProps({ index: index(), value })}
                    class="text-gray-600 hover:text-gray-900 transition-colors text-xs"
                  >
                    &#x2715;
                  </button>
                </div>
                <input
                  {...api().getItemInputProps({ index: index(), value })}
                  class="hidden absolute left-0 top-0 w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
                />
              </span>
            )}
          </For>
        </div>
        <input
          placeholder="Add tag..."
          {...api().getInputProps()}
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none placeholder-gray-500"
        />
      </div>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
