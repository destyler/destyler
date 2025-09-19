/** @jsxImportSource solid-js */
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '../../styles/components/label.css'

export default function Label() {
  const id = createUniqueId()
  const [state, send] = useMachine(label.machine({ id }))
  const api = createMemo(() => label.connect(state, send, normalizeProps))

  return (
    <>
      <div>
        <label {...api().getRootProps()}>
          First name
        </label>
        <input id="firstName" type="text" value="Elone Hoo" />
      </div>
    </>
  )
}
