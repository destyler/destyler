import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'
import '../../styles/components/number-input.css'

export default function NumberInput() {
  const [state, send] = useMachine(numberInput.machine({
    id: useId(),
    value: '66',
    allowMouseWheel: true,
  }))

  const api = numberInput.connect(state, send, normalizeProps)

  return (
    <div {...api.getRootProps()}>
      <button {...api.getDecrementTriggerProps()}>
        <span>-</span>
      </button>
      <input {...api.getInputProps()} />
      <button {...api.getIncrementTriggerProps()}>
        <span>+</span>
      </button>
    </div>
  )
}
