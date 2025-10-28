import { normalizeProps, useMachine } from '@destyler/react'
import { checkboxControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/react'
import * as checkbox from '../../index'
import '../style.css'

export default function Checkbox() {
  const controls = useControls(checkboxControls)

  const [state, send] = useMachine(checkbox.machine({
    id: useId(),
  }), {
    context: controls.context,
  })

  const api = checkbox.connect(state, send, normalizeProps)

  return (
    <Layout>
      <main>main</main>
      <label {...api.getRootProps()}>
        <div {...api.getControlProps()} />
        <span {...api.getLabelProps()}>
          Input is
          { api.checked ? ' checked' : ' unchecked' }
        </span>

        <input data-testid="hidden-input" {...api.getHiddenInputProps()} />
      </label>
      <Toolbar controls={controls.ui()}>
        <StateVisualizer state={state} />
      </Toolbar>
    </Layout>
  )
}
