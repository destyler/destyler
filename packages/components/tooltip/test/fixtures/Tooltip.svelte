<script lang="ts">
  import * as tooltip from '@destyler/tooltip'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(tooltip.machine({ id: crypto.randomUUID() }))

  $: api = tooltip.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Tooltip Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
