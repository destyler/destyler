<script lang="ts">
  import * as slider from '@destyler/slider'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(slider.machine({ id: crypto.randomUUID() }))

  $: api = slider.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Slider Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
