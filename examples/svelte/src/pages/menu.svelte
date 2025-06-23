<script lang="ts">
  import * as menu from "@destyler/menu";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { menuControls } from '@destyler/shared-private';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(menuControls);

  const id = $props.id();

  const [state, send] = useMachine(menu.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(menu.connect(state, send, normalizeProps));

  const items = [
    { value: "edit", label: "Edit" },
    { value: "duplicate", label: "Duplicate" },
    { value: "delete", label: "Delete" },
    { value: "export", label: "Export..." },
  ];
</script>

<div class="p-4">
  <button
    {...api.getTriggerProps()}
    class="inline-flex items-center px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
  >
    Actions
    <span
      {...api.getIndicatorProps()}
      class="ml-2"
    >▾</span>
  </button>
  <div
    {...api.getPositionerProps()}
    class="relative"
  >
    <ul
      {...api.getContentProps()}
      class="absolute mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-gray-200 py-1"
    >
      {#each items as item (item.value)}
        <li
          {...api.getItemProps({ value: item.value })}
          class="px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
        >
          {item.label}
        </li>
      {/each}
    </ul>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
