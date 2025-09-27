<script lang="ts">
  import * as qrCode from '@destyler/qr-code'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '../../styles/components/qr-code.css'

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

<div {...api.getRootProps()}>
  <svg {...api.getFrameProps()}>
    <path {...api.getPatternProps()} />
  </svg>
</div>

