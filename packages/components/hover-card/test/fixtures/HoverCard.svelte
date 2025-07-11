<script lang="ts">
  import * as hoverCard from '@destyler/hover-card'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(hoverCard.machine({ id: crypto.randomUUID() }))

  $: api = hoverCard.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  HoverCard Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
