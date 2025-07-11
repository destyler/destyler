<script lang="ts">
  import * as tabs from '@destyler/tabs'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(tabs.machine({ id: crypto.randomUUID() }))

  $: api = tabs.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Tabs Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
