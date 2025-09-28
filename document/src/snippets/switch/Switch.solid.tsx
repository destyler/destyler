/** @jsxImportSource solid-js */
import { normalizeProps, useMachine } from '@destyler/solid'
import * as switchs from '@destyler/switch'
import { createMemo, createUniqueId } from 'solid-js'
import '../../styles/components/switch.css'

export default function Switch() {
  const [state, send] = useMachine(switchs.machine({
    id: createUniqueId(),
    checked: true,
  }))

  const api = createMemo(() => switchs.connect(state, send, normalizeProps))

  return (
    <label {...api().getRootProps()}>
      <input {...api().getHiddenInputProps()} />
      <span {...api().getControlProps()}>
        <span {...api().getThumbProps()} />
      </span>
    </label>
  )
}
