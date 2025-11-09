<script lang="ts">
  import { switchControls } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import * as zagSwitch from "../../index"
  import '../style.css'

  const controls = useControls(switchControls)

  const [snapshot, send] = useMachine(zagSwitch.machine({ id: "1", name: "switch" }), {
    context: controls.context,
  })

  const api = $derived(zagSwitch.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <!-- svelte-ignore a11y_label_has_associated_control -->
    <label {...api.getRootProps()}>
      <input {...api.getHiddenInputProps()} data-testid="hidden-input" />
      <span {...api.getControlProps()}>
        <span {...api.getThumbProps()}></span>
      </span>
      <span {...api.getLabelProps()}>Feature is {api.checked ? "enabled" : "disabled"}</span>
    </label>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
