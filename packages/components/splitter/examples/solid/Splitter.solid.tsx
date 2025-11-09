/** @jsxImportSource solid-js */

import { splitterControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as splitter from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(splitterControls)

  const [state, send] = useMachine(
    splitter.machine({
      id: createUniqueId(),
      size: [
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ],
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => splitter.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main style={{
        'min-width': '400px',
        "min-height": '200px',
      }}
      >
        <div {...api().getRootProps()}>
          <div {...api().getPanelProps({ id: 'a' })}>
            <p>A</p>
          </div>
          <div {...api().getResizeTriggerProps({ id: 'a:b' })} />
          <div {...api().getPanelProps({ id: 'b' })}>
            <p>B</p>
          </div>
        </div>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} omit={['previousPanels', 'initialSize']} />
      </Toolbar>
    </Layout>
  )
}
