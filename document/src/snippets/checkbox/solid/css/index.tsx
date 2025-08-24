/** @jsxImportSource solid-js */
import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './index.css'

export default function Checkbox() {
  const [state, send] = useMachine(checkbox.machine({
    name: 'checkbox',
    id: createUniqueId(),
  }))
  const api = createMemo(() => checkbox.connect(state, send, normalizeProps))

  return (
    <label {...api().getRootProps()} class="root">
      <div
        {...api().getControlProps()}
        class="checkbox-control"
      >
        {api().checked && <div class="checkbox-icon" />}
      </div>
      <span {...api().getLabelProps()} class="checkbox-label">
        Input is
        {' '}
        {api().checked ? ' checked' : ' unchecked'}
      </span>

      <input {...api().getHiddenInputProps()} />
    </label>
  )
}
