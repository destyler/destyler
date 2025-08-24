<script lang="ts">
  import * as qrCode from '@destyler/qr-code'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(
    qrCode.machine({
      id,
      value: 'https://destyler.org',
      encoding: {
        ecc: 'H',
      },
    }),
  )

  const api = $derived(qrCode.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="qr-root">
  <svg {...api.getFrameProps()} class="qr-frame">
    <path {...api.getPatternProps()} class="qr-pattern" />
  </svg>
</div>

<style>
  @import './index.css';
</style>
