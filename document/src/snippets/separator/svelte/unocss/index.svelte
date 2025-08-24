<script lang="ts">
  import * as separator from '@destyler/separator'
  import { normalizeProps, useMachine } from "@destyler/svelte"

  const id = $props.id()

  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id }))
  const api = $derived(separator.connect(state, send, normalizeProps))
</script>

<div class="w-full min-w-90 mx-4">
  <div class="text-primary text-sm font-semibold">
    Destyler UI
  </div>
  <div class="text-primary text-sm mt-0!">
    unstyled component for svelte.
  </div>
  <div
    {...api.getRootProps()}
    class="bg-stone-300/50 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-4"
  >
  </div>
  <div class="flex h-5 items-center mt-0!">
    {#each items as item, index}
      <div class="text-primary text-sm mt-0!">
        {item.label}
      </div>
      {#if index < items.length - 1}
        <div
          {...api.getRootProps('vertical')}
          class="bg-stone-300/50 mt-0! data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px mx-4"
        >
        </div>
      {/if}
    {/each}
  </div>
</div>
