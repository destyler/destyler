<script lang="ts">
import { normalizeProps, useMachine } from '@destyler/svelte'
import { checkboxControls } from '@destyler/shared-private'
import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
import * as checkbox from '../../index'
import '../style.css'

const controls = useControls(checkboxControls)

const id = $props.id()

const [state, send] = useMachine(checkbox.machine({
  id: id,
}), {
  context: controls.context,
})
const api = $derived(checkbox.connect(state, send, normalizeProps))
</script>

<Layout>
  <main>main</main>
  <label {...api.getRootProps()}>
    <div {...api.getControlProps()}></div>
    <span {...api.getLabelProps()}>
      Input is
      { api.checked ? ' checked' : ' unchecked' }
    </span>
    <input data-testid="hidden-input" {...api.getHiddenInputProps()} />
  </label>
  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
