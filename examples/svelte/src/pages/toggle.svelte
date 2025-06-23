<script lang="ts">
  import * as toggle from "@destyler/toggle";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { toggleControls } from '@destyler/shared-private-private';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

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
    class="bg-white p-2 rounded-lg shadow-md space-x-2"
  >
    {#each ['bold', 'italic', 'underline'] as item, index (index)}
      <button
        {...api.getItemProps({ value: item })}
        class="w-10 h-10 rounded-md border border-gray-200 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 font-medium"
        class:bg-gray-800={api.value.includes(item)}
        class:text-white={api.value.includes(item)}
        class:hover:bg-gray-700={api.value.includes(item)}
      >
        {item[0].toUpperCase()}
      </button>
    {/each}
  </div>
</div>


<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
