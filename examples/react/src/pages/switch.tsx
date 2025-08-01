import { normalizeProps, useMachine } from '@destyler/react'
import { switchControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as switchs from '@destyler/switch'
import { useId, useMemo } from 'react'
import '@destyler/shared-private/styles/switch.css'

export default function SwitchPage() {
  const controls = useControls(switchControls)
  const id = useId()

  const [state, send] = useMachine(switchs.machine({ id }), {
    context: controls.context,
  })

  const api = useMemo(() =>
    switchs.connect(state, send, normalizeProps), [state, send])

  return (
    <>
      <label
        {...api.getRootProps()}
        className="switch-root"
      >
        <input {...api.getHiddenInputProps()} className="switch-hidden-input" />
        <span
          {...api.getControlProps()}
          className="switch-control"
        >
          <span
            {...api.getThumbProps()}
            className="switch-thumb"
          />
        </span>
        <span
          {...api.getLabelProps()}
          className="switch-label"
        >
          {api.checked ? 'open' : 'close'}
        </span>
      </label>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
