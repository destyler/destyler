<script lang="ts">
  import * as edit from '@destyler/edit'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(edit.machine({ id: crypto.randomUUID() }))

  $: api = edit.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Edit Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
