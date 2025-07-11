<script lang="ts">
  import * as signature from '@destyler/signature'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(signature.machine({ id: crypto.randomUUID() }))

  $: api = signature.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Signature Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
