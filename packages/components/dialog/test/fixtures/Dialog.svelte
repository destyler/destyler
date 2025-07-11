<script lang="ts">
  import * as dialog from '@destyler/dialog'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(dialog.machine({ id: crypto.randomUUID() }))

  $: api = dialog.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Dialog Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
