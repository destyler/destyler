/** @jsxImportSource solid-js */
import { otpInputControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'

import * as otpInput from '../../index'
import '../style.css'

export default function Page() {
  const controls = useControls(otpInputControls)

  const [state, send] = useMachine(
    otpInput.machine({
      id: createUniqueId(),
      name: 'test',
    }),
    {
      context: controls.context,
    },
  )

  const api = createMemo(() => otpInput.connect(state, send, normalizeProps))

  return (
    <Layout>
      <main class="pin-input">
        <div {...api().getRootProps()}>
          <label {...api().getLabelProps()}>Enter code:</label>
          <div {...api().getControlProps()}>
            <input data-testid="input-1" {...api().getInputProps({ index: 0 })} />
            <input data-testid="input-2" {...api().getInputProps({ index: 1 })} />
            <input data-testid="input-3" {...api().getInputProps({ index: 2 })} />
          </div>
          <input {...api().getHiddenInputProps()} />
        </div>
        <button data-testid="clear-button" onClick={api().clearValue}>
          Clear
        </button>
      </main>

      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
