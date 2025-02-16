<script lang="ts">
  import * as tabs from "@destyler/tabs";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { tabsControls } from '@destyler/shared';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

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

<div {...api.getRootProps()} class="max-w-md p-6 bg-white rounded-lg shadow-md">
  <div {...api.getListProps()} class="flex gap-2 mb-6 border-b border-gray-200">
    {#each data as item (item.value)}
      <button
        {...api.getTriggerProps({ value: item.value })}
        class="px-4 py-2 hover:bg-gray-100 transition-colors
        duration-200 relative after:absolute after:bottom-[-1px]
        after:left-0 after:w-full after:h-[2px] after:bg-black
        after:opacity-0 data-[selected]:after:opacity-100 rounded-md
        data-[selected]:font-medium data-[selected]:bg-gray-100"
      >
        {item.label}
      </button>
    {/each}
  </div>
  {#each data as item (item.value)}
    <div
      {...api.getContentProps({ value: item.value })}
      class="p-4 bg-gray-50 rounded-lg data-[hidden]:hidden"
    >
      <p class="text-gray-800">{item.content}</p>
    </div>
  {/each}
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>

