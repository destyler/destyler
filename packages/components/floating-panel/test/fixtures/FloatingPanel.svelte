<script lang="ts">
  import * as floatingPanel from '@destyler/floating-panel'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(floatingPanel.machine({ id: crypto.randomUUID() }))

  $: api = floatingPanel.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  FloatingPanel Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
