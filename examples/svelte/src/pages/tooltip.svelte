<script lang="ts">
  import '@destyler/shared-private/styles/tooltip.css'
  import * as tooltip from "@destyler/tooltip";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const id = $props.id();
  const [state, send] = useMachine(tooltip.machine({ id }));

  const api = $derived(tooltip.connect(state, send, normalizeProps));
</script>

<div class="tooltip-root">
  <button
    {...api.getTriggerProps()}
    class="tooltip-trigger"
  >
    Hover me
  </button>
  <div {...api.getPositionerProps()} class="tooltip-positioner">
    <div
      {...api.getContentProps()}
      class="tooltip-content"
    >
      Tooltip
    </div>
  </div>
</div>

<Toolbar>
  <StateVisualizer state={state} />
</Toolbar>

