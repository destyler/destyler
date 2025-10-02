<script lang="ts">
  import * as separator from '@destyler/separator'
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import '@docs/styles/components/separator.css'

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
  <div {...api.getRootProps()}>
  </div>
  <div class="flex h-5 items-center mt-0!">
    {#each items as item, index}
      <div class="text-primary text-sm mt-0!">
        {item.label}
      </div>
      {#if index < items.length - 1}
        <div {...api.getRootProps('vertical')}>
        </div>
      {/if}
    {/each}
  </div>
</div>
