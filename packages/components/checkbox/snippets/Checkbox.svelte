<script lang="ts">
  import * as checkbox from '@destyler/checkbox'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import './style.css'

  const id = $props.id()

  const [state, send] = useMachine(checkbox.machine({ id }))

  const api = $derived(checkbox.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()}>
  <div
    {...api.getControlProps()}
  >
    {#if api.checked}
      <div ></div>
    {/if}
  </div>
  <span {...api.getLabelProps()}>
    Input is
    {#if api.checked}
      checked
    {:else}
      unchecked
    {/if}
  </span>

  <input {...api.getHiddenInputProps()}>
</label>
