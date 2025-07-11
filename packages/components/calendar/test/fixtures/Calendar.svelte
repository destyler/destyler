<script lang="ts">
  import * as calendar from '@destyler/calendar'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(calendar.machine({ id: crypto.randomUUID() }))

  $: api = calendar.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Calendar Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
