/** @jsxImportSource solid-js */

import { tabsControls, tabsData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import * as tabs from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(tabsControls)

  const [state, send] = useMachine(tabs.machine({ id: createUniqueId(), value: 'nils' }), {
    context: controls.context,
  })

  const api = createMemo(() => tabs.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <div {...api().getIndicatorProps()} />

          <div {...api().getListProps()}>
            <For each={tabsData}>
              {item => (
                <button data-testid={`${item.id}-tab`} {...api().getTriggerProps({ value: item.id })}>
                  {item.label}
                </button>
              )}
            </For>
          </div>

          <For each={tabsData}>
            {item => (
              <div data-testid={`${item.id}-tab-panel`} {...api().getContentProps({ value: item.id })}>
                <p>{item.content}</p>
                {item.id === 'agnes' ? <input placeholder="Agnes" /> : null}
              </div>
            )}
          </For>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
