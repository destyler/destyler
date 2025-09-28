<script lang="ts">
  import * as tooltip from "@destyler/tooltip";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import '../../styles/components/tooltip.css'

  const id = $props.id();
  const [state, send] = useMachine(tooltip.machine({ id }));

  const api = $derived(tooltip.connect(state, send, normalizeProps));
</script>

<div class="flex items-center justify-center min-h-[200px] mt-0!">
  <button {...api.getTriggerProps()}>
    Hover me
  </button>
  <div {...api.getPositionerProps()}>
    <div {...api.getContentProps()}>
      This is a tooltip following the mouse cursor.
    </div>
  </div>
</div>


