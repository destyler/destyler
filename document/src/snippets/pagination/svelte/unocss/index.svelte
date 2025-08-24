<script lang="ts">
  import * as pagination from '@destyler/pagination'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(pagination.machine({ id, count: 1000 }))

  const api = $derived(pagination.connect(state, send, normalizeProps))
</script>

<nav {...api.getRootProps()} class="flex justify-center mt-0!">
  <ul class="flex flex-row items-center gap-1 m-0! list-none!">
    <li>
      <a
        {...api.getPrevTriggerProps()}
        class="no-underline! text-primary! inline-flex cursor-pointer h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        <div class="w-4 h-4 i-carbon:chevron-left mr-1" ></div>
        Previous
      </a>
    </li>
    {#each api.pages as page, i}
      <li>
        {#if page.type === 'page'}
          <a
            {...api.getItemProps(page)}
            class="no-underline! text-primary! inline-flex cursor-pointer h-9 w-9 items-center justify-center rounded-md border border-input bg-background text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[selected]:bg-accent data-[selected]:text-accent-foreground"
          >
            {page.value}
          </a>
        {:else}
          <span
            {...api.getEllipsisProps({ index: i })}
            class="inline-flex h-9 cursor-pointer w-9 items-center justify-center text-sm font-medium text-muted-foreground!"
          >&#8230;</span>
        {/if}
      </li>
    {/each}
    <li>
      <a
        {...api.getNextTriggerProps()}
        class="no-underline! text-primary! inline-flex h-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      >
        Next
        <div class="w-4 h-4 i-carbon:chevron-right ml-1" ></div>
      </a>
    </li>
  </ul>
</nav>
