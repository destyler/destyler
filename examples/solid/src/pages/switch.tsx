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
      <label
        {...api().getRootProps()}
        class="switch-root"
      >
        <input {...api().getHiddenInputProps()} class="switch-hidden-input" />
        <span
          {...api().getControlProps()}
          class="switch-control"
        >
          <span
            {...api().getThumbProps()}
            class="switch-thumb"
          />
        </span>
        <span
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
