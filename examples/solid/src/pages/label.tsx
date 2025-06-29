import * as label from '@destyler/label'
import { StateVisualizer, Toolbar } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function Label() {
  const id = createUniqueId()
  const [state, send] = useMachine(label.machine({ id }))
  const api = createMemo(() => label.connect(state, send, normalizeProps))

  return (
    <>
      <label {...api().getRootProps()}>
        text
      </label>
      <Toolbar>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
