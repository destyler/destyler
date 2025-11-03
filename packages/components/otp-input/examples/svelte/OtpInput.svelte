<script lang="ts">
  import * as pinInput from "../../index"
  import { otpInputControls } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(otpInputControls)

  const [snapshot, send] = useMachine(
    pinInput.machine({
      name: "test",
      id: "1",
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(pinInput.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label {...api.getLabelProps()}>Enter code:</label>
      <div {...api.getControlProps()}>
        <input data-testid="input-1" {...api.getInputProps({ index: 0 })} />
        <input data-testid="input-2" {...api.getInputProps({ index: 1 })} />
        <input data-testid="input-3" {...api.getInputProps({ index: 2 })} />
      </div>
      <input {...api.getHiddenInputProps()} />
    </div>
    <button data-testid="clear-button" onclick={api.clearValue}> Clear </button>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
