<script lang="ts">
  import * as switchs from '@destyler/switch'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '@docs/styles/components/switch.css'

  const id = $props.id()

  const [state, send] = useMachine(switchs.machine({
    id,
    checked: true
  }))

  const api = $derived(switchs.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()}>
  <input {...api.getHiddenInputProps()}>
  <span {...api.getControlProps()}>
    <span {...api.getThumbProps()}></span>
  </span>
</label>
