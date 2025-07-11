<script lang="ts">
  import * as dynamic from '@destyler/dynamic'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(dynamic.machine({ id: crypto.randomUUID() }))

  $: api = dynamic.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Dynamic Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
