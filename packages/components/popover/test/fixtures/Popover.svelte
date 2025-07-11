<script lang="ts">
  import * as popover from '@destyler/popover'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(popover.machine({ id: crypto.randomUUID() }))

  $: api = popover.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Popover Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
