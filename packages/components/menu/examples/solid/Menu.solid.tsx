/** @jsxImportSource solid-js */
import { menuControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import { Portal } from 'solid-js/web'
import * as menu from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(menuControls)
  const [state, send] = useMachine(menu.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => menu.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main>
        <button {...api().getTriggerProps()}>
          Actions
          {' '}
          <span {...api().getIndicatorProps()}>▾</span>
        </button>

        <Portal>
          <div {...api().getPositionerProps()}>
            <ul {...api().getContentProps()}>
              <li {...api().getItemProps({ value: 'edit' })}>Edit</li>
              <li {...api().getItemProps({ value: 'duplicate' })}>Duplicate</li>
              <li {...api().getItemProps({ value: 'delete' })}>Delete</li>
              <li {...api().getItemProps({ value: 'export' })}>Export...</li>
            </ul>
          </div>
        </Portal>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
