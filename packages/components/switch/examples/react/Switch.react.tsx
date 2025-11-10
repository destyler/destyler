import { normalizeProps, useMachine } from '@destyler/react'
import { switchControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as switchs from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(switchControls)

  const [state, send] = useMachine(
    switchs.machine({
      id: useId(),
      name: 'switch',
    }),
    {
      context: controls.context,
    },
  )

  const api = switchs.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <label {...api.getRootProps()}>
          <input {...api.getHiddenInputProps()} data-testid="hidden-input" />
          <span {...api.getControlProps()}>
            <span {...api.getThumbProps()} />
          </span>
          <span {...api.getLabelProps()}>
            Feature is
            {' '}
            {api.checked ? 'enabled' : 'disabled'}
          </span>
        </label>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
