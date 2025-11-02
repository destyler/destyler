<script lang="ts">
  import * as numberInput from "../../index"
  import { numberInputControls } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(numberInputControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(numberInput.machine({ id: id }), {
    context: controls.context,
  })

  const api = $derived(numberInput.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <div data-testid="scrubber" {...api.getScrubberProps()}></div>
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label data-testid="label" {...api.getLabelProps()}> Enter number: </label>
      <div {...api.getControlProps()}>
        <button data-testid="dec-button" {...api.getDecrementTriggerProps()}> DEC </button>
        <input data-testid="input" {...api.getInputProps()} />
        <button data-testid="inc-button" {...api.getIncrementTriggerProps()}> INC </button>
      </div>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} omit={["formatter", "parser"]} />
  </Toolbar>
</Layout>
