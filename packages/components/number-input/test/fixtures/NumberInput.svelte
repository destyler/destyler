<script lang="ts">
  import * as numberInput from '@destyler/number-input'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(numberInput.machine({ id: crypto.randomUUID() }))

  $: api = numberInput.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  NumberInput Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
