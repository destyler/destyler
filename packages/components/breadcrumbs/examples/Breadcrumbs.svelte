<script lang="ts">
  import type { BreadcrumbItem } from '../index'
  import * as breadcrumbs from '../index'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import {Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import './style.css'

  let items: BreadcrumbItem[] = [
    { id: '1', label: 'one', href: '/' },
    { id: '2', label: 'two', href: '/products' },
    { id: '3', label: 'three' },
  ]

  const uid = $props.id();

  const [snapshot, send] = useMachine(breadcrumbs.machine({
    id: uid,
    items,
  }))

  const api = $derived(breadcrumbs.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <nav {...api.getRootProps()}>
    <ol {...api.getListProps()} class="breadcrumbs-root">
      {#each api.items as item (item.id)}
        <li {...api.getItemProps(item)}>
          <a {...api.getLinkProps(item)} class="breadcrumbs-link">{item.label}</a>
          {#if item.href}
            <span {...api.getSeparatorProps()}>/</span>
          {/if}
        </li>
      {/each}
    </ol>
  </nav>

  <Toolbar>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
