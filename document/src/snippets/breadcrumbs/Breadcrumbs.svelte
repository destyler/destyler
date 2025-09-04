<script lang="ts">
  import type { BreadcrumbItem } from '@destyler/breadcrumbs'
  import * as breadcrumbs from '@destyler/breadcrumbs'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '../../styles/components/breadcrumbs.css'

  let items: BreadcrumbItem[] = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'Components', href: '/components/checkbox' },
    { id: '3', label: 'Breadcrumbs' },
  ]

  const uid = $props.id();

  const [state, send] = useMachine(breadcrumbs.machine({
    id: uid,
    items,
  }))

  const api = $derived(breadcrumbs.connect(state, send, normalizeProps))
</script>

<nav {...api.getRootProps()}>
  <ol {...api.getListProps()}>
    {#each api.items as item (item.id)}
      <li {...api.getItemProps(item)}>
        <a {...api.getLinkProps(item)}>{item.label}</a>
        {#if item.href}
          <span {...api.getSeparatorProps()}></span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
