<script lang="ts">
  import * as colorPicker from '@destyler/color-picker'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(colorPicker.machine({ id: crypto.randomUUID() }))

  $: api = colorPicker.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  ColorPicker Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
