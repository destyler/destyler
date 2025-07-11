<script lang="ts">
  import * as tour from '@destyler/tour'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(tour.machine({ id: crypto.randomUUID() }))

  $: api = tour.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Tour Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
