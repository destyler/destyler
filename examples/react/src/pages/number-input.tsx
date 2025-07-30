import * as numberInput from '@destyler/number-input'
import { normalizeProps, useMachine } from '@destyler/react'
import { numberInputControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/number-input.css'

export default function NumberInputExample() {
  const controls = useControls(numberInputControls)

  const [state, send] = useMachine(numberInput.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = numberInput.connect(state, send, normalizeProps)

  return (
    <>
      <div
        className="number-input-root"
        {...api.getRootProps()}
      >
        <label
          className="number-input-label"
          {...api.getLabelProps()}
        >
          Enter number
        </label>
        <div className="number-input-action">
          <button
            className="number-input-trigger"
            data-testid="dec:trigger"
            {...api.getDecrementTriggerProps()}
          >
            <span>-</span>
          </button>
          <input
            data-testid="input"
            className="number-input-input"
            {...api.getInputProps()}
          />
          <button
            className="number-input-trigger"
            data-testid="inc:trigger"
            {...api.getIncrementTriggerProps()}
          >
            <span>+</span>
          </button>
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
