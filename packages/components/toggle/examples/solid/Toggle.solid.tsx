/** @jsxImportSource solid-js */

import { toggleControls, toggleData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId, For } from 'solid-js'
import * as toggle from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(toggleControls)

  const [state, send] = useMachine(toggle.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => toggle.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main class="toggle-group">
        <button>Outside</button>
        <div {...api().getRootProps()}>
          <For each={toggleData}>
            {item => <button {...api().getItemProps({ value: item.value })}>{item.label}</button>}
          </For>
        </div>
      </main>

      <Toolbar controls={controls.ui} viz>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
