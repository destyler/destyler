<script lang="ts">
  import * as switchs from '@destyler/switch'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(switchs.machine({ 
    id,
    checked: true 
  }))

  const api = $derived(switchs.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()} class="switch-root">
  <input {...api.getHiddenInputProps()}>
  <span
    {...api.getControlProps()}
    class="switch-control"
  >
    <span
      {...api.getThumbProps()}
      class="switch-thumb"
    ></span>
  </span>
</label>

<style>
  @import './index.css';
</style>
