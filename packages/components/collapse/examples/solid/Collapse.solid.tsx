/** @jsxImportSource solid-js */
import { collapseControls, collapseData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { For } from 'solid-js/web'
import * as collapse from '../../index'
import '../style.css'

export default function Collapse() {
  const controls = useControls(collapseControls)

  const [state, send] = useMachine(collapse.machine({
    id: createUniqueId(),
  }), {
    context: controls.context,
  })

  const api = createMemo(() => collapse.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <For each={collapseData}>
            {item => (
              <div {...api().getItemProps({ value: item.id })}>
                <h3>
                  <button data-testid={`${item.id}:trigger`} {...api().getItemTriggerProps({ value: item.id })}>
                    {item.title}
                    <div {...api().getItemIndicatorProps({ value: item.id })}>
                      &gt;
                    </div>
                  </button>
                </h3>
                <div {...api().getItemContentProps({ value: item.id })} data-testid={`${item.id}:content`}>
                  {item.content}
                </div>
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
