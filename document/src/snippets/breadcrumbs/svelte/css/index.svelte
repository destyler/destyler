<script lang="ts">
  import type { BreadcrumbItem } from '@destyler/breadcrumbs'
  import * as breadcrumbs from '@destyler/breadcrumbs'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './index.css'

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
  <ol {...api.getListProps()} class="breadcrumb-list">
    {#each api.items as item (item.id)}
      <li {...api.getItemProps(item)} class="breadcrumb-item">
        <a {...api.getLinkProps(item)} class="breadcrumb-link">{item.label}</a>
        {#if item.href}
          <span {...api.getSeparatorProps()} class="breadcrumb-separator"></span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
