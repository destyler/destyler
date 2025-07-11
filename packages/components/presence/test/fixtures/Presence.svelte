<script lang="ts">
  import * as presence from '@destyler/presence'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(presence.machine({ id: crypto.randomUUID() }))

  $: api = presence.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Presence Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
