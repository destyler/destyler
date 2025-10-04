import { normalizeProps, useMachine } from '@destyler/react'
import * as switchs from '@destyler/switch'
import { useId } from 'react'
import './style.css'

export default function Switch() {
  const [state, send] = useMachine(switchs.machine({
    id: useId(),
    checked: true,
  }))

  const api = switchs.connect(state, send, normalizeProps)

  return (
    <label {...api.getRootProps()}>
      <input {...api.getHiddenInputProps()} />
      <span {...api.getControlProps()}>
        <span {...api.getThumbProps()} />
      </span>
    </label>
  )
}
