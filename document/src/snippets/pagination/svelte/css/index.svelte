<script lang="ts">
  import * as pagination from '@destyler/pagination'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(pagination.machine({ id, count: 1000 }))

  const api = $derived(pagination.connect(state, send, normalizeProps))
</script>

<nav {...api.getRootProps()} class="pagination-nav">
  <ul class="pagination-list">
    <li>
      <a
        {...api.getPrevTriggerProps()}
        class="pagination-button pagination-prev"
      >
        <div class="pagination-icon pagination-prev-icon i-carbon:chevron-left"></div>
        Previous
      </a>
    </li>
    {#each api.pages as page, i}
      <li>
        {#if page.type === 'page'}
          <a
            {...api.getItemProps(page)}
            class="pagination-button pagination-page"
          >
            {page.value}
          </a>
        {:else}
          <span
            {...api.getEllipsisProps({ index: i })}
            class="pagination-ellipsis"
          >&#8230;</span>
        {/if}
      </li>
    {/each}
    <li>
      <a
        {...api.getNextTriggerProps()}
        class="pagination-button pagination-next"
      >
        Next
        <div class="pagination-icon pagination-next-icon i-carbon:chevron-right"></div>
      </a>
    </li>
  </ul>
</nav>
