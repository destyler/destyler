<script lang="ts">
  import * as clipboard from '@destyler/clipboard'
  import { clipboardControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(clipboardControls)

  const [state, send] = useMachine(
    clipboard.machine({
      id: crypto.randomUUID(),
      value: 'https://github.com/destyler/destyler',
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(clipboard.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="max-w-md p-6">
  <label {...api.getLabelProps()} class="block text-sm font-medium text-gray-800 mb-2">
    Copy Link
  </label>
  <div {...api.getControlProps()} class="flex items-center gap-2 mt-1">
    <div class="relative flex-1">
      <input
        {...api.getInputProps()}
        class="block w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 transition-all"
        readonly
      />
    </div>
    <button
      {...api.getTriggerProps()}
      class="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 {api.copied ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
    >
      {#if api.copied}
        <div class="transform transition-transform duration-200 i-carbon:checkmark w-5 h-5" ></div>
      {:else}
        <div class="i-carbon:copy w-5 h-5" ></div>
      {/if}
    </button>
  </div>
  <p class="mt-2 text-sm text-gray-500">
    Click the button to copy link to clipboard
  </p>
</div>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
