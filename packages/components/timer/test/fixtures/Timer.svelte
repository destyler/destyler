<script lang="ts">
  import * as timer from '@destyler/timer'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(timer.machine({ id: crypto.randomUUID() }))

  $: api = timer.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Timer Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
