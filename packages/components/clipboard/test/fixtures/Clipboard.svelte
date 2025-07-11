<script lang="ts">
  import * as clipboard from '@destyler/clipboard'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(clipboard.machine({ id: crypto.randomUUID() }))

  $: api = clipboard.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  Clipboard Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
