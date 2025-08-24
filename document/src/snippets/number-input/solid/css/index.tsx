/** @jsxImportSource solid-js */
import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

export default function NumberInput() {
  const [state, send] = useMachine(numberInput.machine({
    id: createUniqueId(),
    value: '66',
    allowMouseWheel: true,
  }))

  const api = createMemo(() => numberInput.connect(state, send, normalizeProps))

  return (
    <div
      class="number-input"
      {...api().getRootProps()}
    >
      <div class="number-input-container">
        <button
          class="number-input-button"
          {...api().getDecrementTriggerProps()}
        >
          <span class="number-input-button-text">-</span>
        </button>
        <input
          class="number-input-field"
          {...api().getInputProps()}
        />
        <button
          class="number-input-button"
          {...api().getIncrementTriggerProps()}
        >
          <span class="number-input-button-text">+</span>
        </button>
      </div>
    </div>
  )
}
