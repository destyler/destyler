import * as checkbox from '@destyler/checkbox'
import { normalizeProps, useMachine } from '@destyler/react'
import { checkboxControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import { useId } from 'react'
import '@destyler/shared-private/styles/checkbox.css'

export default function CheckboxPage() {
  const id = useId()

  const controls = useControls(checkboxControls)

  const [state, send] = useMachine(checkbox.machine({ id }), {
    context: controls.context,
  })

  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <>
      <main>main</main>
      <label {...api.getRootProps()} className="checkbox-root">
        <div
          {...api.getControlProps()}
          className="checkbox-control"
        >
          {api.checked
            && (
              <div className="checkbox-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32"><path fill="currentColor" d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9z" /></svg>
              </div>
            )}
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
