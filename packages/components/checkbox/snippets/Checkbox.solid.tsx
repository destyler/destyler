/** @jsxImportSource solid-js */
import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

export default function Checkbox() {
  const [state, send] = useMachine(checkbox.machine({
    name: 'checkbox',
    id: createUniqueId(),
  }))
  const api = createMemo(() => checkbox.connect(state, send, normalizeProps))

  return (
    <label {...api().getRootProps()}>
      <div {...api().getControlProps()}>
        {api().checked && <div />}
      </div>
      <span {...api().getLabelProps()}>
        Input is
        {' '}
        {api().checked ? ' checked' : ' unchecked'}
      </span>

      <input {...api().getHiddenInputProps()} />
    </label>
  )
}
