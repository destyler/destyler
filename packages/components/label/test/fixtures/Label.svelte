<script lang="ts">
  import * as label from '@destyler/label'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [state, send] = useMachine(label.machine({ id: crypto.randomUUID() }))

  $: api = label.connect($state, send, normalizeProps)
</script>

<label {...api.getRootProps()}>
  Test Label
</label>

<Toolbar>
  <StateVisualizer state={$state} />
</Toolbar>