<script lang="ts">
  import * as checkbox from '@destyler/checkbox'
  import { checkboxControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/checkbox.css'

  const controls = useControls(checkboxControls)
  const id = $props.id()

  const [snapshot, send] = useMachine(checkbox.machine({ id }), {
    context: controls.context
  })

  const api = $derived(checkbox.connect(snapshot, send, normalizeProps))
</script>

<main>main</main>
<label {...api.getRootProps()} class="checkbox-root">
  <div
    {...api.getControlProps()}
    class="checkbox-control"
  >
    {#if api.checked}
      <div class="checkbox-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9z" /></svg>
      </div>
    {/if}
  </div>
  <span {...api.getLabelProps()}>
    Input is
    {#if api.checked}
      <span>checked</span>
    {:else}
      <span>unchecked</span>
    {/if}
  </span>

  <input data-testid="hidden-input" {...api.getHiddenInputProps()}>
</label>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
