import { normalizeProps, useMachine } from '@destyler/react'
import { toggleControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as toggle from '@destyler/toggle'
import { useId } from 'react'

export default function TogglePage() {
  const controls = useControls(toggleControls)

  const [state, send] = useMachine(toggle.machine({ id: useId() }), {
    context: controls.context,
  })

  const api = toggle.connect(state, send, normalizeProps)

  return (
    <>
      <div className="flex">
        <div
          {...api.getRootProps()}
          className="toggle-root"
        >
          {['bold', 'italic', 'underline'].map(item => (
            <button
              key={item}
              {...api.getItemProps({ value: item })}
              className="toggle-control"
            >
              {item[0].toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
