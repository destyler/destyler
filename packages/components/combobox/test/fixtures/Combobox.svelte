<script lang="ts">
  import * as combobox from '@destyler/combobox'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(combobox.machine({ id: crypto.randomUUID() }))

  $: api = combobox.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Combobox Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
