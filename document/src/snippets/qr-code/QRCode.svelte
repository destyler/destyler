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

<div {...api.getRootProps()} class="size-135px">
  <svg {...api.getFrameProps()} class="size-135px bg-background">
    <path {...api.getPatternProps()} class="fill-primary" />
  </svg>
</div>

