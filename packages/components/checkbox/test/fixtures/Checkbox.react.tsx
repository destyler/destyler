import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/react'
import { checkboxControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'

export default function CheckboxPage() {
  const id = useId()

  const controls = useControls(checkboxControls)

  const [state, send] = useMachine(checkbox.machine({ id }), {
    context: controls.context,
  })

  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <>
      <label {...api.getRootProps()}>
        <div
          {...api.getControlProps()}
        >
          {api.checked && <div />}
        </div>
        <span {...api.getLabelProps()}>
          Input is
          {api.checked ? <span> checked</span> : <span> unchecked</span>}
        </span>

        <input data-testid="hidden-input" {...api.getHiddenInputProps()} />
      </label>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
