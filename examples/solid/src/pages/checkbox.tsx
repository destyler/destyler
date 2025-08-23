/** @jsxImportSource solid-js */
import * as checkbox from '@destyler/checkbox'
import { checkboxControls } from '@destyler/shared-private'
import { StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/solid'
import { normalizeProps, useMachine } from '@destyler/solid'
import { createMemo, createUniqueId } from 'solid-js'
import '@destyler/shared-private/styles/checkbox.css'

export default function CheckboxPage() {
  const controls = useControls(checkboxControls)

  const [state, send] = useMachine(checkbox.machine({
    name: 'checkbox',
    id: createUniqueId(),
  }), {
    context: controls.context,
  })

  const api = createMemo(() => checkbox.connect(state, send, normalizeProps))

  return (
    <>
      <main>main</main>
      <label {...api().getRootProps()} class="checkbox-root">
        <div
          {...api().getControlProps()}
          class="checkbox-control"
        >
          {api().checked && <div class="checkbox-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32"><path fill="currentColor" d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9z" /></svg></div>}
        </div>
        <span {...api().getLabelProps()}>
          Input is
          { api().checked ? <span> checked</span> : <span> unchecked</span> }
        </span>

        <input data-testid="hidden-input" {...api().getHiddenInputProps()} />
      </label>
      <Toolbar controls={controls.ui}>
        <StateVisualizer state={state} />
      </Toolbar>
    </>
  )
}
