import { normalizeProps, useMachine } from '@destyler/react'
import { tabsControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as tabs from '@destyler/tabs'
import { useId } from 'react'
import '@destyler/shared-private/styles/tabs.css'

export default function TabsDemo() {
  const controls = useControls(tabsControls)

  const data = [
    { value: 'item-1', label: 'Item one', content: 'Item one content' },
    { value: 'item-2', label: 'Item two', content: 'Item two content' },
    { value: 'item-3', label: 'Item three', content: 'Item three content' },
  ]

  const [state, send] = useMachine(tabs.machine({ id: useId(), value: 'item-1' }), {
    context: controls.context,
  })
  const api = tabs.connect(state, send, normalizeProps)

  return (
    <>
      <div {...api.getRootProps()} className="tabs-root">
        <div {...api.getListProps()} className="tabs-list">
          {data.map(item => (
            <button
              key={item.value}
              {...api.getTriggerProps({ value: item.value })}
              className="tabs-trigger"
              data-testid={`${item.value}-tab`}
            >
              {item.label}
            </button>
          ))}
        </div>
        {data.map(item => (
          <div
            key={item.value}
            {...api.getContentProps({ value: item.value })}
            className="tabs-content"
            data-testid={`${item.value}-tab-panel`}
          >
            <p className="tabs-content-text">{item.content}</p>
          </div>
        ))}
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
