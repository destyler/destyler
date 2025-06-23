<script lang="ts">
  import * as dynamic from "@destyler/dynamic";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { dynamicControls } from '@destyler/shared-private';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(dynamicControls);

  const [state, send] = useMachine(
    dynamic.machine({
      id: crypto.randomUUID(),
      value: ["React", "Vue"],
    }),
    {
      context: controls.context,
    }
  );

  const api = $derived(dynamic.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="max-w-md p-6">
  <div class="flex flex-wrap gap-2 mb-4">
    {#each api.value as value, index (index)}
      <span {...api.getItemProps({ index, value })} class="relative group">
        <div
          {...api.getItemPreviewProps({ index, value })}
          class="bg-gray-100 text-gray-900 rounded-lg px-3 py-1 flex items-center gap-2"
        >
          <span class="text-sm font-medium">{value}</span>
          <button
            {...api.getItemDeleteTriggerProps({ index, value })}
            class="text-gray-600 hover:text-gray-900 transition-colors text-xs"
          >
            &#x2715;
          </button>
        </div>
        <input
          {...api.getItemInputProps({ index, value })}
          class="hidden absolute left-0 top-0 w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none"
        />
      </span>
    {/each}
  </div>
  <input
    placeholder="Add tag..."
    {...api.getInputProps()}
    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none placeholder-gray-500"
  />
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
