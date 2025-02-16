<script lang="ts">
  import * as checkbox from '@destyler/checkbox'
  import { checkboxControls } from '@destyler/shared'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'

  const controls = useControls(checkboxControls)
  const id = $props.id()

  const [state, send] = useMachine(checkbox.machine({ id }), {
    context: controls.context
  })

  const api = $derived(checkbox.connect(state, send, normalizeProps))
</script>

<label {...api.getRootProps()} class="flex gap-2.5 justify-start items-center cursor-pointer">
  <div
    {...api.getControlProps()}
    class="h-4 w-4 shrink-0 rounded-sm border border-dark
    shadow focus-visible:outline-none focus-visible:ring-1
    disabled:cursor-not-allowed disabled:opacity-50
    data-[state=checked]:bg-dark data-[state=checked]:text-light
    flex justify-center items-center"
  >
    {#if api.checked}
      <div class="i-carbon:checkmark w-3 h-3 text-light" >
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

  <input {...api.getHiddenInputProps()}>
</label>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
