<script lang="ts">
  import * as splitter from '@destyler/splitter'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(splitter.machine({ id: crypto.randomUUID() }))

  $: api = splitter.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Splitter Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
