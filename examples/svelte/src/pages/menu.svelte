<script lang="ts">
  import * as menu from "@destyler/menu";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { menuControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/menu.css'

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

<div class="menu-root">
  <button
    {...api.getTriggerProps()}
    class="menu-trigger"
  >
    Actions
    <span
      {...api.getIndicatorProps()}
      class="menu-indicator"
    >▾</span>
  </button>
  <div
    {...api.getPositionerProps()}
    class="menu-positioner"
  >
    <ul
      {...api.getContentProps()}
      class="menu-content"
    >
      {#each items as item (item.value)}
        <li
          {...api.getItemProps({ value: item.value })}
          class="menu-item"
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
