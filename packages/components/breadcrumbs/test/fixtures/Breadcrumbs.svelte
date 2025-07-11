<script lang="ts">
  import * as breadcrumbs from '@destyler/breadcrumbs'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(breadcrumbs.machine({ id: crypto.randomUUID() }))

  $: api = breadcrumbs.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Breadcrumbs Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
