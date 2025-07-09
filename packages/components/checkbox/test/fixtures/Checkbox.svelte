<script lang="ts">
  import * as checkbox from '../../index'
  import { checkboxControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(checkboxControls)
  const id = $props.id()

  const [state, send] = useMachine(checkbox.machine({ id }), {
    context: controls.context
  })

  const api = $derived(checkbox.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()}>
  <div
    {...api.getControlProps()}
  >
    {#if api.checked}
      <div >
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
  <StateVisualizer state={state} />
</Toolbar>
