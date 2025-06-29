<script lang="ts">
  import * as tooltip from "@destyler/tooltip";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const id = $props.id();
  const [state, send] = useMachine(tooltip.machine({ id }));

  const api = $derived(tooltip.connect(state, send, normalizeProps));
</script>

<div class="">
  <button
    {...api.getTriggerProps()}
    class="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-200"
  >
    Hover me
  </button>
  <div {...api.getPositionerProps()} class="z-50">
    <div
      {...api.getContentProps()}
      class="px-3 py-2 bg-white text-gray-900 rounded-md shadow-lg border border-gray-200 text-sm transition-opacity duration-200"
    >
      Tooltip
    </div>
  </div>
</div>

<Toolbar>
  <StateVisualizer state={state} />
</Toolbar>

