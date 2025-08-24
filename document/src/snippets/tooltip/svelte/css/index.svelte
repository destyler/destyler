<script lang="ts">
  import * as tooltip from "@destyler/tooltip";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import "./index.css";

  const id = $props.id();
  const [state, send] = useMachine(tooltip.machine({ id }));

  const api = $derived(tooltip.connect(state, send, normalizeProps));
</script>

<div class="tooltip-container">
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
      This is a tooltip following the mouse cursor.
    </div>
  </div>
</div>


