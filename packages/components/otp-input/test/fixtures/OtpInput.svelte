<script lang="ts">
  import * as otpInput from '@destyler/otp-input'
  import { StateVisualizer, Toolbar } from '@destyler/shared-private/svelte'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const [stateStore, send] = useMachine(otpInput.machine({ id: crypto.randomUUID() }))

  $: api = otpInput.connect($stateStore, send, normalizeProps)
</script>

<div {...api.getRootProps()}>
  OtpInput Component
</div>

<Toolbar>
  <StateVisualizer state={$stateStore} />
</Toolbar>
