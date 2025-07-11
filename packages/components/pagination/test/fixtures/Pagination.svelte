<script lang="ts">
  import * as pagination from '@destyler/pagination'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(pagination.machine({ id: crypto.randomUUID() }))

  $: api = pagination.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Pagination Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
