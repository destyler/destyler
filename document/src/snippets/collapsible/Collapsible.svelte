<script lang="ts">
  import * as collapsible from '@destyler/collapsible'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './collapsible.css'

  const id = $props.id()

  const [state, send] = useMachine(collapsible.machine({ id }))

  const api = $derived(collapsible.connect(state, send, normalizeProps))
</script>

<div
  class="w-350px max-w-sm my-8"
  {...api.getRootProps()}
>
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm! font-semibold">
      @elonehoo starred 3 repositories
    </h4>
    <button
      class="group m-0! size-6! hover:bg-background p-1 rounded-md flex justify-center items-center"
      {...api.getTriggerProps()}
    >
      <div
        class="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 i-carbon:chevron-down"
      >
      </div>
    </button>
  </div>

  <div class="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm">
    @destyler/collapsible
  </div>

  <div
    class="overflow-hidden rounded-b-md content"
    {...api.getContentProps()}
  >
    <div class="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm">
      @destyler/svelte
    </div>
    <div class="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm">
      svelte
    </div>
  </div>
</div>
