<script lang="ts">
  import * as tree from '@destyler/tree'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(tree.machine({ id: crypto.randomUUID() }))

  $: api = tree.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Tree Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
