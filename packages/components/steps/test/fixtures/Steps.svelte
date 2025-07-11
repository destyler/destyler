<script lang="ts">
  import * as steps from '@destyler/steps'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(steps.machine({ id: crypto.randomUUID() }))

  $: api = steps.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Steps Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
