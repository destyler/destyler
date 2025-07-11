<script lang="ts">
  import * as fileUpload from '@destyler/file-upload'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(fileUpload.machine({ id: crypto.randomUUID() }))

  $: api = fileUpload.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  FileUpload Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
