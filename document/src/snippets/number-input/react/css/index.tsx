import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { useId } from 'react'

export default function NumberInput() {
  const [state, send] = useMachine(numberInput.machine({
    id: useId(),
    value: '66',
    allowMouseWheel: true,
  }))

  const api = numberInput.connect(state, send, normalizeProps)

  return (
    <div
      className="number-input"
      {...api.getRootProps()}
    >
      <div className="number-input-container">
        <button
          className="number-input-button"
          {...api.getDecrementTriggerProps()}
        >
          <span className="number-input-button-text">-</span>
        </button>
        <input
          className="number-input-field"
          {...api.getInputProps()}
        />
        <button
          className="number-input-button"
          {...api.getIncrementTriggerProps()}
        >
          <span className="number-input-button-text">+</span>
        </button>
      </div>
    </div>
  )
}
