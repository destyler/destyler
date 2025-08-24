<script lang="ts">
  import * as checkbox from '@destyler/checkbox'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(checkbox.machine({ id }))

  const api = $derived(checkbox.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()} class="root">
  <div
    {...api.getControlProps()}
    class="checkbox-control"
  >
    {#if api.checked}
      <div class="checkbox-label" ></div>
    {/if}
  </div>
  <span {...api.getLabelProps()} class="checkbox-label">
    Input is
    {#if api.checked}
      checked
    {:else}
      unchecked
    {/if}
  </span>

  <input {...api.getHiddenInputProps()}>
</label>

<style>
  @import './index.css';
</style>
