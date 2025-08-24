/** @jsxImportSource solid-js */
import * as label from '@destyler/label'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Label() {
  const id = createUniqueId()
  const [state, send] = useMachine(label.machine({ id }))
  const api = createMemo(() => label.connect(state, send, normalizeProps))

  return (
    <>
      <div class="label-container">
        <label
          {...api().getRootProps()}
          class="label"
        >
          First name
        </label>
        <input
          id="firstName"
          class="input"
          type="text"
          value="Elone Hoo"
        />
      </div>
    </>
  )
}
