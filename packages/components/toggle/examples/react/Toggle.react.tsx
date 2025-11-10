import { normalizeProps, useMachine } from '@destyler/react'
import { toggleControls, toggleData } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as toggle from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(toggleControls)

  const [state, send] = useMachine(toggle.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = toggle.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main className="toggle-group">
        <button>Outside</button>
        <div {...api.getRootProps()}>
          {toggleData.map(item => (
            <button key={item.value} {...api.getItemProps({ value: item.value })}>
              {item.label}
            </button>
          ))}
        </div>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
