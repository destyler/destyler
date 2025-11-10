import { normalizeProps, useMachine } from '@destyler/react'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as label from '../../index'

export default function Label() {
  const id = useId()
  const [state, send] = useMachine(label.machine({ id }))
  const api = label.connect(state, send, normalizeProps)

  return (
    <Layout>
      <label {...api.getRootProps()}>
        text
      </label>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
