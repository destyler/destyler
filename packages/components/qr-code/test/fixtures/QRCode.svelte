<script lang="ts">
  import * as qrCode from '@destyler/qr-code'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(qrCode.machine({ id: crypto.randomUUID() }))

  $: api = qrCode.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  QrCode Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
