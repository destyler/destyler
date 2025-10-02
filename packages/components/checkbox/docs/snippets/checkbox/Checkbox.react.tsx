import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '@docs/styles/components/checkbox.css'

export default function Checkbox() {
  const [state, send] = useMachine(checkbox.machine({ id: useId() }))
  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <label {...api.getRootProps()}>
      <div {...api.getControlProps()}>
        {api.checked && <div />}
      </div>
      <span {...api.getLabelProps()}>
        Input is
        {' '}
        {api.checked ? ' checked' : ' unchecked'}
      </span>

      <input {...api.getHiddenInputProps()} />
    </label>
  )
}
