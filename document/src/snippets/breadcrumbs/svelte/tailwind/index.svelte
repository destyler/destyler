<script lang="ts">
  import type { BreadcrumbItem } from '@destyler/breadcrumbs'
  import * as breadcrumbs from '@destyler/breadcrumbs'
  import { normalizeProps, useMachine } from '@destyler/svelte'

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
  <ol {...api.getListProps()} class="mt-0! flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
    {#each api.items as item (item.id)}
      <li {...api.getItemProps(item)} class="inline-flex items-center gap-1.5 mt-0!">
        <a {...api.getLinkProps(item)} class="transition-colors hover:text-foreground no-underline! data-[current=page]:text-foreground">{item.label}</a>
        {#if item.href}
          <span {...api.getSeparatorProps()} class="i-carbon:chevron-right size-3"></span>
        {/if}
      </li>
    {/each}
  </ol>
</nav>
