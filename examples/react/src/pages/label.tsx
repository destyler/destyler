import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import { StateVisualizer } from '../components/tool/StateVisualizer'
import { Toolbar } from '../components/tool/Toolbar'

export default function Label() {
  const id = useId()
  const [state, send] = useMachine(label.machine({ id }))
  const api = label.connect(state, send, normalizeProps)

  return (
    <>
      <label {...api.getRootProps()}>
        text
      </label>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
