<script lang="ts">
  import * as dialog from '@destyler/dialog';
  import { dialogControls } from '@destyler/shared-private';
  import { normalizeProps, useMachine } from '@destyler/svelte';
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(dialogControls);

  const id = $props.id();

  const [state, send] = useMachine(dialog.machine({
    id,
  }), {
    context: controls.context,
  });

  const api = $derived(dialog.connect(state, send, normalizeProps));
</script>

<button
  {...api.getTriggerProps()}
  class="px-4 py-2 bg-dark text-white rounded-md hover:bg-black transition-colors"
>
  Open Dialog
</button>

<div>
  <div
    {...api.getBackdropProps()}
    class="fixed inset-0 bg-black/60 backdrop-blur-sm"
  ></div>
  <div
    {...api.getPositionerProps()}
    class="fixed inset-0 flex items-center justify-center"
  >
    <div
      {...api.getContentProps()}
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative border border-gray-200"
    >
      <h2
        {...api.getTitleProps()}
        class="text-xl font-semibold text-black mb-4"
      >
        Edit profile
      </h2>
      <p
        {...api.getDescriptionProps()}
        class="text-gray-500 mb-6"
      >
        Make changes to your profile here. Click save when you are done.
      </p>
      <button
        {...api.getCloseTriggerProps()}
        class="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
      >
        <div class="w-4 h-4 i-carbon:close-large" ></div>
      </button>
      <input
        placeholder="Enter name..."
        class="w-full px-3 py-2 border border-gray-200 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black"
      >
      <button class="w-full px-4 py-2 bg-dark text-white rounded-md hover:bg-black transition-colors">
        Save Changes
      </button>
    </div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
