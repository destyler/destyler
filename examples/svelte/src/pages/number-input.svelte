<script lang="ts">
  import * as numberInput from "@destyler/number-input";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { numberInputControls } from '@destyler/shared'
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(numberInputControls)

  const id = $props.id()

  const [ state, send ] = useMachine(numberInput.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(numberInput.connect(state, send, normalizeProps))
</script>

<div
  class="max-w-[300px] mx-auto my-5 p-4"
  {...api.getRootProps()}
>
  <label
    class="block mb-2 text-sm text-gray-700"
    {...api.getLabelProps()}
  >
    Enter number
  </label>
  <div class="flex items-center gap-2">
    <button
      class="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all duration-200"
      {...api.getDecrementTriggerProps()}
    >
      <span class="text-xl font-bold">-</span>
    </button>
    <input
      class="w-full h-10 px-2 text-center text-gray-700 border border-gray-200 rounded-md outline-none transition-colors duration-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
      {...api.getInputProps()}
    />
    <button
      class="flex items-center justify-center w-10 h-10 text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-300 active:bg-gray-200 transition-all duration-200"
      {...api.getIncrementTriggerProps()}
    >
      <span class="text-xl font-bold">+</span>
    </button>
  </div>
</div>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
