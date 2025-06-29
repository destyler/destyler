import { tabsControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tabs from '@destyler/tabs'
import { createMemo, createUniqueId } from 'solid-js'

export default function TabsDemo() {
  const controls = useControls(tabsControls)

  const data = [
    { value: 'item-1', label: 'Item one', content: 'Item one content' },
    { value: 'item-2', label: 'Item two', content: 'Item two content' },
    { value: 'item-3', label: 'Item three', content: 'Item three content' },
  ]

  const [state, send] = useMachine(tabs.machine({ id: createUniqueId(), value: 'item-1' }), {
    context: controls.context,
  })
  const api = createMemo(() => tabs.connect(state, send, normalizeProps))

  return (
    <>
      <div {...api().getRootProps()} class="max-w-md p-6 bg-white rounded-lg shadow-md">
        <div {...api().getListProps()} class="flex gap-2 mb-6 border-b border-gray-200">
          {data.map(item => (
            <button
              {...api().getTriggerProps({ value: item.value })}
              class="px-4 py-2 hover:bg-gray-100 transition-colors duration-200 relative after:absolute after:bottom-[-1px] after:left-0 after:w-full after:h-[2px] after:bg-black after:opacity-0 data-[selected]:after:opacity-100 rounded-md data-[selected]:font-medium data-[selected]:bg-gray-100"
            >
              {item.label}
            </button>
          ))}
        </div>
        {data.map(item => (
          <div
            {...api().getContentProps({ value: item.value })}
            class="p-4 bg-gray-50 rounded-lg data-[hidden]:hidden"
          >
            <p class="text-gray-800">{item.content}</p>
          </div>
        ))}
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
