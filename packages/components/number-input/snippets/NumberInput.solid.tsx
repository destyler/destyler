/** @jsxImportSource solid-js */
import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import './style.css'

export default function NumberInput() {
  const [state, send] = useMachine(numberInput.machine({
    id: createUniqueId(),
    value: '66',
    allowMouseWheel: true,
  }))

  const api = createMemo(() => numberInput.connect(state, send, normalizeProps))

  return (
    <div {...api().getRootProps()}>
      <button {...api().getDecrementTriggerProps()}>
        <span>-</span>
      </button>
      <input {...api().getInputProps()} />
      <button {...api().getIncrementTriggerProps()}>
        <span>+</span>
      </button>
    </div>
  )
}
