/** @jsxImportSource react */
import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import './index.css'

export default function Checkbox() {
  const [state, send] = useMachine(checkbox.machine({ id: useId() }))
  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <label {...api.getRootProps()} className="root">
      <div
        {...api.getControlProps()}
        className="checkbox-control"
      >
        {api.checked && <div className="checkbox-icon" />}
      </div>
      <span {...api.getLabelProps()} className="checkbox-label">
        Input is
        {' '}
        {api.checked ? ' checked' : ' unchecked'}
      </span>

      <input {...api.getHiddenInputProps()} />
    </label>
  )
}
