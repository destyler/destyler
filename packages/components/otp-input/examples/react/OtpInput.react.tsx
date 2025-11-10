import { normalizeProps, useMachine } from '@destyler/react'
import { otpInputControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import * as otpInput from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(otpInputControls)

  const [state, send] = useMachine(
    otpInput.machine({
      name: 'test',
      id: useId(),
    }),
    {
      context: controls.context,
    },
  )

  const api = otpInput.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>
        <div {...api.getRootProps()}>
          <label {...api.getLabelProps()}>Enter code:</label>
          <div {...api.getControlProps()}>
            <input data-testid="input-1" {...api.getInputProps({ index: 0 })} />
            <input data-testid="input-2" {...api.getInputProps({ index: 1 })} />
            <input data-testid="input-3" {...api.getInputProps({ index: 2 })} />
          </div>
          <input {...api.getHiddenInputProps()} />
        </div>
        <button data-testid="clear-button" onClick={api.clearValue}>
          Clear
        </button>
      </main>

      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
