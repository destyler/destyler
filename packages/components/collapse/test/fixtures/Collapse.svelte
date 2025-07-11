<script lang="ts">
  import * as collapse from '@destyler/collapse'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(collapse.machine({ id: crypto.randomUUID() }))

  $: api = collapse.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Collapse Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
