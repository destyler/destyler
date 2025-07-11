<script lang="ts">
  import * as toggle from '@destyler/toggle'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(toggle.machine({ id: crypto.randomUUID() }))

  $: api = toggle.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Toggle Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
