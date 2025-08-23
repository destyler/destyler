/** @jsxImportSource solid-js */
import { tabsControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as tabs from '@destyler/tabs'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/tabs.css'

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
      <div {...api().getRootProps()} class="tabs-root">
        <div {...api().getListProps()} class="tabs-list">
          {data.map(item => (
            <button
              {...api().getTriggerProps({ value: item.value })}
              class="tabs-trigger"
              data-testid={`${item.value}-tab`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {data.map(item => (
          <div
            {...api().getContentProps({ value: item.value })}
            class="tabs-content"
            data-testid={`${item.value}-tab-panel`}
          >
            <p class="tabs-content-text">{item.content}</p>
          </div>
        ))}
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
