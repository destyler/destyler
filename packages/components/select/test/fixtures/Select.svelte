<script lang="ts">
  import * as select from '@destyler/select'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(select.machine({ id: crypto.randomUUID() }))

  $: api = select.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Select Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
