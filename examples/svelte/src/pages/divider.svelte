<script lang="ts">
  import * as separator from '@destyler/separator'
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"

  const id = $props.id()

  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id }))
  const api = $derived(separator.connect(state, send, normalizeProps))
</script>

<div class="w-full max-w-75 mx-4">
  <div class="text-black text-sm font-semibold">
    Destyler UI
  </div>
  <div class="text-black text-sm">
    unstyled component for vue.
  </div>
  <div
    {...api.getRootProps()}
    class="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
  >
  </div>
  <div class="flex h-5 items-center">
    {#each items as item, index}
      <div class="text-black text-sm">
        {item.label}
      </div>
      {#if index < items.length - 1}
        <div
          {...api.getRootProps('vertical')}
          class="bg-dark data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
        >
        </div>
      {/if}
    {/each}
  </div>
</div>

<Toolbar>
  <StateVisualizer state={state} />
</Toolbar>
