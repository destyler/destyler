<script lang="ts">
  import * as select from "@destyler/select"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { selectControls } from '@destyler/shared'
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(selectControls)

  const selectData = [
    { label: "Nigeria", value: "NG" },
    { label: "Japan", value: "JP" },
    //...
  ]

  const [state, send] = useMachine(
    select.machine({
      id: crypto.randomUUID(),
      collection: select.collection({
        items: selectData,
      }),
    }), {
      context: controls.context,
    }
  )

  const api = $derived(select.connect(state, send, normalizeProps))
</script>

<div class="flex flex-col space-y-2 p-4">
  <label
    {...api.getLabelProps()}
    class="text-sm font-medium text-gray-700 dark:text-gray-200"
  >
    Label
  </label>
  <button
    {...api.getTriggerProps()}
    class="group flex items-center justify-between w-xs px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
  >
    <span>{api.valueAsString || "Select option"}</span>
    <span class="transition-transform duration-300 i-carbon:chevron-right w-4 h-4 text-gray-400 group-data-[state=open]:rotate-90"></span>
  </button>
</div>

<div
  {...api.getPositionerProps()}
  class="relative z-50 w-[--reference-width]"
>
  <ul
    {...api.getContentProps()}
    class="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto focus:outline-none dark:bg-gray-800 dark:border-gray-700"
  >
    {#each selectData as item (item.value)}
      <li
        {...api.getItemProps({ item })}
        class="flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
      >
        <span>{item.label}</span>
        <span
          {...api.getItemIndicatorProps({ item })}
          class="text-gray-600 dark:text-gray-400"
        >
          ✓
        </span>
      </li>
    {/each}
  </ul>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
