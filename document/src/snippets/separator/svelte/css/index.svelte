<script lang="ts">
  import * as separator from '@destyler/separator'
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import './index.css'

  const id = $props.id()

  const items = [
    { label: 'Blog', value: 'blog' },
    { label: 'Docs', value: 'docs' },
    { label: 'Source', value: 'source' },
  ]

  const [state, send] = useMachine(separator.machine({ id }))
  const api = $derived(separator.connect(state, send, normalizeProps))
</script>

<div class="container">
  <div class="title">
    Destyler UI
  </div>
  <div class="subtitle">
    unstyled component for svelte.
  </div>
  <div
    {...api.getRootProps()}
    class="separator-horizontal"
  >
  </div>
  <div class="items-row">
    {#each items as item, index}
      <div class="item-label">
        {item.label}
      </div>
      {#if index < items.length - 1}
        <div
          {...api.getRootProps('vertical')}
          class="separator-vertical"
        >
        </div>
      {/if}
    {/each}
  </div>
</div>
