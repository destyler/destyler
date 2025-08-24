<script lang="ts">
  import * as collapsible from '@destyler/collapsible'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(collapsible.machine({ id }))
  const api = $derived(collapsible.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="w-350px max-w-sm my-8!">
  <div class="flex items-center justify-between space-x-4 px-4">
    <h4 class="text-sm! font-semibold">
      @elonehoo starred 3 repositories
    </h4>
    <button
      class="group m-0! size-6! hover:bg-background p-1 rounded-md flex justify-center items-center"
      {...api.getTriggerProps()}
    >
      <div
        class="h-4 w-4 text-muted-foreground transition-transform 
        duration-200 i-carbon:chevron-down group-data-[state=open]:rotate-180"
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
    <div class="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm mt-2!">
      @destyler/svelte
    </div>
    <div class="rounded-md text-primary border border-border px-4 py-2 font-mono text-sm shadow-sm mt-2!">
      svelte
    </div>
  </div>
</div>

<style>
.content[data-state='open'] {
  animation: slideDown 450ms cubic-bezier(0.16, 1, 0.3, 1);
}
.content[data-state='closed'] {
  animation: slideUp 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideDown {
  from { height: 0; }
  to { height: var(--destyler-height); }
}

@keyframes slideUp {
  from { height: var(--destyler-height); }
  to { height: 0; }
}
</style>
