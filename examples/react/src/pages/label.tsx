import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/react'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/react'
import { useId } from 'react'

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
