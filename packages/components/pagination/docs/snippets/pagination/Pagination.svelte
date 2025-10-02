<script lang="ts">
  import * as pagination from '@destyler/pagination'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '@docs/styles/components/pagination.css'

  const id = $props.id()

  const [state, send] = useMachine(pagination.machine({ id, count: 1000 }))

  const api = $derived(pagination.connect(state, send, normalizeProps))
</script>

<nav {...api.getRootProps()}>
  <ul >
    <li>
      <a {...api.getPrevTriggerProps()}>
        <div ></div>
      </a>
    </li>
    {#each api.pages as page, i}
      <li>
        {#if page.type === 'page'}
          <a {...api.getItemProps(page)}>
            {page.value}
          </a>
        {:else}
          <span {...api.getEllipsisProps({ index: i })}>&#8230;</span>
        {/if}
      </li>
    {/each}
    <li>
      <a {...api.getNextTriggerProps()}>
        <div ></div>
      </a>
    </li>
  </ul>
</nav>
