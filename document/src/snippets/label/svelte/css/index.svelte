<script lang="ts">
  import * as label from '@destyler/label'
  import { normalizeProps, useMachine } from "@destyler/svelte"

  const id = $props.id()
  const [state, send] = useMachine(label.machine({ id }))

  const api = $derived(label.connect(state, send, normalizeProps))
</script>

<div class="label-container">
  <label 
    {...api.getRootProps()}
    class="label"
  >
    First name
  </label>
  <input
    id="firstName"
    class="input"
    type="text"
    value="Elone Hoo"
  >
</div>

<style>
  @import './index.css';
</style>
