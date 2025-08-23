<script lang="ts">
  import * as numberInput from "@destyler/number-input";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { numberInputControls } from '@destyler/shared-private'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/number-input.css'

  const controls = useControls(numberInputControls)

  const id = $props.id()

  const [ state, send ] = useMachine(numberInput.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(numberInput.connect(state, send, normalizeProps))
</script>

<div
  class="number-input-root"
  {...api.getRootProps()}
>
  <label
    class="number-input-label"
    {...api.getLabelProps()}
  >
    Enter number
  </label>
  <div class="number-input-action">
    <button
      class="number-input-trigger"
      data-testid="dec:trigger"
      {...api.getDecrementTriggerProps()}
    >
      <span>-</span>
    </button>
    <input
      data-testid="input"
      class="number-input-input"
      {...api.getInputProps()}
    />
    <button
      class="number-input-trigger"
      data-testid="inc:trigger"
      {...api.getIncrementTriggerProps()}
    >
      <span>+</span>
    </button>
  </div>
</div>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
