/** @jsxImportSource solid-js */
import { collapsibleControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import * as collapsible from '../../index'
import '../style.css'

export default function Collapsible() {
  const controls = useControls(collapsibleControls)

  const [state, send] = useMachine(collapsible.machine({
    id: createUniqueId(),
  }), {
    context: controls.context,
  })

  const api = createMemo(() => collapsible.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <div {...api().getRootProps()}>
          <button {...api().getTriggerProps()}>
            Collapsible Trigger
          </button>
          <div {...api().getContentProps()}>
            <p>
              Lorem dfd dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
              magna sfsd. Ut enim ad minimdfd v eniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
              commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
              id est laborum.
              {' '}
              <a href="#">Some Link</a>
            </p>
          </div>
        </div>
      </main>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
