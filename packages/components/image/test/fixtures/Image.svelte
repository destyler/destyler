<script lang="ts">
  import * as image from '@destyler/image'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(image.machine({ id: crypto.randomUUID() }))

  $: api = image.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Image Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
