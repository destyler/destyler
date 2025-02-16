<script lang="ts">
  import type { BreadcrumbItem } from '@destyler/breadcrumbs'
  import * as breadcrumbs from '@destyler/breadcrumbs'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  let items: BreadcrumbItem[] = [
    { id: '1', label: 'one', href: '/' },
    { id: '2', label: 'two', href: '/products' },
    { id: '3', label: 'three' },
  ]

  const uid = $props.id();

  const [state, send] = useMachine(breadcrumbs.machine({
    id: uid,
    items,
  }))

  const api = $derived(breadcrumbs.connect(state, send, normalizeProps))
</script>

<nav {...api.getRootProps()}>
  <ol {...api.getListProps()} class="flex items-center space-x-2">
    {#each api.items as item (item.id)}
      <li {...api.getItemProps(item)}>
        <a {...api.getLinkProps(item)} class="text-blue-500 hover:underline">{item.label}</a>
        {#if item.href}
          <span {...api.getSeparatorProps()}>/</span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
