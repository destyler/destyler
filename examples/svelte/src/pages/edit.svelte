<script lang="ts">
  import * as edit from "@destyler/edit";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { editControls } from '@destyler/shared';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(editControls);

  const [state, send] = useMachine(edit.machine({
    id: crypto.randomUUID(),
    placeholder: 'Type something...',
  }))

  const api = $derived(edit.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="max-w-md p-6 bg-white rounded-lg shadow-md border border-gray-200">
  <div {...api.getAreaProps()} class="mb-4">
    <input
      {...api.getInputProps()}
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
    />
    <span
      {...api.getPreviewProps()}
      class="block mt-2 text-gray-700"
    ></span>
  </div>
  <div class="flex justify-end space-x-2">
    {#if api.editing}
      <div class="space-x-2">
        <button
          {...api.getSubmitTriggerProps()}
          class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        >
          Save
        </button>
        <button
          {...api.getCancelTriggerProps()}
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    {:else}
      <button
        {...api.getEditTriggerProps()}
        class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      >
        Edit
      </button>
    {/if}
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
