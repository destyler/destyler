<script lang="ts">
  import * as toggle from "@destyler/toggle";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { toggleControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(toggleControls);

  const id = $props.id();
  const [state, send] = useMachine(toggle.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(toggle.connect(state, send, normalizeProps));
</script>

<div class="flex">
  <div
    {...api.getRootProps()}
    class="toggle-root"
  >
    {#each ['bold', 'italic', 'underline'] as item, index (index)}
      <button
        {...api.getItemProps({ value: item })}
        class="toggle-control"
      >
        {item[0].toUpperCase()}
      </button>
    {/each}
  </div>
</div>


<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
