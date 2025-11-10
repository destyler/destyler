import { normalizeProps, Portal, useMachine } from '@destyler/react'
import { menuControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as menu from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(menuControls)
  const [state, send] = useMachine(menu.machine({
    id: useId(),
    // eslint-disable-next-line no-console
    onSelect: console.log,
  }), {
    context: controls.context,
  })

  const api = menu.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <button {...api.getTriggerProps()}>
          Actions
          {' '}
          <span {...api.getIndicatorProps()}>▾</span>
        </button>
        {api.open && (
          <Portal>
            <div {...api.getPositionerProps()}>
              <ul {...api.getContentProps()}>
                <li {...api.getItemProps({ value: 'edit' })}>Edit</li>
                <li {...api.getItemProps({ value: 'duplicate' })}>Duplicate</li>
                <li {...api.getItemProps({ value: 'delete' })}>Delete</li>
                <li {...api.getItemProps({ value: 'export' })}>Export...</li>
              </ul>
            </div>
          </Portal>
        )}
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
