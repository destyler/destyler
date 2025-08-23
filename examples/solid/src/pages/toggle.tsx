/** @jsxImportSource solid-js */
import { toggleControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import * as toggle from '@destyler/toggle'
import { createMemo, createUniqueId } from 'solid-js'

export default function TogglePage() {
  const controls = useControls(toggleControls)

  const [state, send] = useMachine(toggle.machine({ id: createUniqueId() }), {
    context: controls.context,
  })

  const api = createMemo(() => toggle.connect(state, send, normalizeProps))

  return (
    <>
      <div class="flex">
        <div
          {...api().getRootProps()}
          class="toggle-root"
        >
          {['bold', 'italic', 'underline'].map(item => (
            <button
              {...api().getItemProps({ value: item })}
              class="toggle-control"
            >
              {item[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
