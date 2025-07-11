<script lang="ts">
  import * as toast from '@destyler/toast'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(toast.machine({ id: crypto.randomUUID() }))

  $: api = toast.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Toast Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
