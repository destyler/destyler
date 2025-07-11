<script lang="ts">
  import * as radio from '@destyler/radio'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(radio.machine({ id: crypto.randomUUID() }))

  $: api = radio.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Radio Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
