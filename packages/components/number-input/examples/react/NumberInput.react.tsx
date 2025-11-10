import { normalizeProps, useMachine } from '@destyler/react'
import { numberInputControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as numberInput from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(numberInputControls)

  const [state, send] = useMachine(
    numberInput.machine({
      id: useId(),
    }),
    {
      context: controls.context,
    },
  )

  const api = numberInput.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <div data-testid="scrubber" {...api.getScrubberProps()} />
          <label data-testid="label" {...api.getLabelProps()}>
            Enter number:
          </label>
          <div {...api.getControlProps()}>
            <button data-testid="dec-button" {...api.getDecrementTriggerProps()}>
              DEC
            </button>
            <input data-testid="input" {...api.getInputProps()} />
            <button data-testid="inc-button" {...api.getIncrementTriggerProps()}>
              INC
            </button>
          </div>
        </div>
      </main>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} omit={['formatter', 'parser']} />
      </Toolbar>
    </Layout>
  )
}
