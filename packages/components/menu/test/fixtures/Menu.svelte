<script lang="ts">
  import * as menu from '@destyler/menu'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(menu.machine({ id: crypto.randomUUID() }))

  $: api = menu.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Menu Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
