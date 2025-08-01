<script lang="ts">
  import * as tabs from "@destyler/tabs";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { tabsControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/tabs.css'

  const controls = useControls(tabsControls);

  const data = [
    { value: "item-1", label: "Item one", content: "Item one content" },
    { value: "item-2", label: "Item two", content: "Item two content" },
    { value: "item-3", label: "Item three", content: "Item three content" },
  ];

  const uid = $props.id();

  const [state, send] = useMachine(tabs.machine({ id: uid, value: "item-1" }), {
    context: controls.context,
  });
  const api = $derived(tabs.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="tabs-root">
  <div {...api.getListProps()} class="tabs-list">
    {#each data as item (item.value)}
      <button
        {...api.getTriggerProps({ value: item.value })}
        class="tabs-trigger"
      >
        {item.label}
      </button>
    {/each}
  </div>
  {#each data as item (item.value)}
    <div
      {...api.getContentProps({ value: item.value })}
      class="tabs-content"
    >
      <p class="tabs-content-text">{item.content}</p>
    </div>
  {/each}
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>

