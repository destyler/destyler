<script lang="ts">
  import * as pagination from "@destyler/pagination"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { paginationControls } from '@destyler/shared-private'
  import { useControls, Toolbar, StateVisualizer } from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/pagination.css'

  const controls = useControls(paginationControls)

  const id = $props.id()

  const [state, send] = useMachine(pagination.machine({ id: id, count: 1000 }), {
    context: controls.context,
  })
  const api = $derived(pagination.connect(state, send, normalizeProps))
</script>

<nav class="pagination-root" {...api.getRootProps()}>
  <ul class="pagination-list">
    <li>
      <a
        class="pagination-btn"
        {...api.getPrevTriggerProps()}
        data-testid="prev:trigger"
      >
        <div class="pagination-icon i-carbon:chevron-left"></div>
        Previous <span class="sr-only">Page</span>
      </a>
    </li>
    {#each api.pages as page, i (page.type === 'page' ? page.value : `ellipsis-${i}`)}
      <li>
        {#if page.type === 'page'}
          <button
            class="pagination-page"
            {...api.getItemProps(page)}
            data-testid={`pagination-item-${page.value}`}
          >
            {page.value}
          </button>
        {:else}
          <span
            class="pagination-ellipsis"
            {...api.getEllipsisProps({ index: i })}
          >&#8230;</span>
        {/if}
      </li>
    {/each}
    <li>
      <a
        class="pagination-btn"
        {...api.getNextTriggerProps()}
        data-testid="next:trigger"
      >
        Next <span class="sr-only">Page</span>
        <div class="pagination-icon i-carbon:chevron-right"></div>
      </a>
    </li>
  </ul>
</nav>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
