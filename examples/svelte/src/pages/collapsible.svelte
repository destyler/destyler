<script lang="ts">
  import * as collapsible from '@destyler/collapsible'
  import { collapsibleControls } from '@destyler/shared-private-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(collapsibleControls)

  const id = $props.id()

  const [state, send] = useMachine(collapsible.machine({ id }), {
    context: controls.context,
  })

  const api = $derived(collapsible.connect(state, send, normalizeProps))
</script>

<div
  class="max-w-md my-8 rounded-lg overflow-hidden shadow-md"
  {...api.getRootProps()}
>
  <button
    class="group w-full px-4 py-3 flex justify-between items-center bg-gray-100 hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
    {...api.getTriggerProps()}
  >
    <span>Toggle Content</span>
    <div
      class="
      text-sm transition-transform duration-300 ease-in-out
      group-data-[state=open]:rotate-180 i-carbon:chevron-down
      "
    >
    </div>
  </button>

  <div
    class="bg-white overflow-hidden content"
    {...api.getContentProps()}
  >
    <div class="p-4 leading-relaxed">
      <p class="text-gray-700 my-2">
        This is a collapsible demo content. You can place any content here that you want to show or hide.
      </p>
      <p class="text-gray-700 my-2">
        Click the button above to toggle the content state.
      </p>
    </div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>

<style>
  @keyframes slideDown {
    from {
      height: 0;
    }
    to {
      height: var(--destyler-height);
    }
  }

  @keyframes slideUp {
    from {
      height: var(--destyler-height);
    }
    to {
      height: 0;
    }
  }

  :global(.content[data-state='open']) {
    animation: slideDown 250ms cubic-bezier(0.87, 0, 0.13, 1);
  }
  :global(.content[data-state='closed']) {
    animation: slideUp 250ms cubic-bezier(0.87, 0, 0.13, 1);
  }
</style>
