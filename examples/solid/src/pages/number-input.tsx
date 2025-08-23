/** @jsxImportSource solid-js */
import * as numberInput from '@destyler/number-input'
import { numberInputControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/number-input.css'

export default function NumberInputExample() {
  const controls = useControls(numberInputControls)
  const id = createUniqueId()

  const [state, send] = useMachine(numberInput.machine({ id }), {
    context: controls.context,
  })

  const api = createMemo(() => numberInput.connect(state, send, normalizeProps))

  return (
    <>
      <div
        class="number-input-root"
        {...api().getRootProps()}
      >
        <label
          class="number-input-label"
          {...api().getLabelProps()}
        >
          Enter number
        </label>
        <div class="number-input-action">
          <button
            class="number-input-trigger"
            data-testid="dec:trigger"
            {...api().getDecrementTriggerProps()}
          >
            <span>-</span>
          </button>
          <input
            data-testid="input"
            class="number-input-input"
            {...api().getInputProps()}
          />
          <button
            class="number-input-trigger"
            data-testid="inc:trigger"
            {...api().getIncrementTriggerProps()}
          >
            <span>+</span>
          </button>
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
