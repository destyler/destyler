<script lang="ts">
  import * as collapsible from '@destyler/collapsible'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(collapsible.machine({ id: crypto.randomUUID() }))

  $: api = collapsible.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Collapsible Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
