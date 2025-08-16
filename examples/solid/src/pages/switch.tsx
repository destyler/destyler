/** @jsxImportSource solid-js */
import { switchControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as switchs from '@destyler/switch'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/switch.css'

export default function SwitchPage() {
  const controls = useControls(switchControls)
  const id = createUniqueId()

  const [state, send] = useMachine(switchs.machine({ id }), {
    context: controls.context,
  })

  const api = createMemo(() =>
    switchs.connect(state, send, normalizeProps))

  return (
    <>
      <h1 data-testid="click">
        Switch
      </h1>
      <label
        {...api().getRootProps()}
        class="switch-root"
      >
        <input data-testid="input" {...api().getHiddenInputProps()} class="switch-hidden-input" />
        <span
          data-testid="control"
          {...api().getControlProps()}
          class="switch-control"
        >
          <span
            {...api().getThumbProps()}
            class="switch-thumb"
          />
        </span>
        <span
          data-testid="label"
          {...api().getLabelProps()}
          class="switch-label"
        >
          {api().checked ? 'open' : 'close'}
        </span>
      </label>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
