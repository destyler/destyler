<script lang="ts">
  import { clipboardControls } from '@destyler/shared-private'
import { Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/svelte'
import { normalizeProps, useMachine } from '@destyler/svelte'
import * as clipboard from '../../index'
import '../style.css'

const controls = useControls(clipboardControls)

const id = $props.id()

const [state, send] = useMachine(clipboard.machine({
  id: id,
  value: 'https://destyler.org',
}), {
  context: controls.context,
})
const api = $derived(clipboard.connect(state, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <label {...api.getLabelProps()}>Copy this link</label>
      <div {...api.getControlProps()}>
        <input {...api.getInputProps()} style="width: 100%;" />
        <button {...api.getTriggerProps()}>
          { api.copied ? 'Copied' : 'Copy' }
        </button>
      </div>
      <div {...api.getIndicatorProps({ copied: true })}>
        Copied!
      </div>
      <div {...api.getIndicatorProps({ copied: false })}>
        Copy
      </div>
    </div>
  </main>
  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
