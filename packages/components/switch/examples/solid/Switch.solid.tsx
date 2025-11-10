/** @jsxImportSource solid-js */

import { switchControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as switchs from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(switchControls)

  const [state, send] = useMachine(
    switchs.machine({
      name: 'switch',
      id: createUniqueId(),
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => switchs.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <label {...api().getRootProps()}>
          <input {...api().getHiddenInputProps()} />
          <span {...api().getControlProps()}>
            <span {...api().getThumbProps()} />
          </span>
          <span {...api().getLabelProps()}>
            Feature is
            {' '}
            {api().checked ? 'enabled' : 'disabled'}
          </span>
        </label>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
