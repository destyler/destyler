<script lang="ts">
  import * as switchs from "@destyler/switch";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { switchControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/switch.css'

  const controls = useControls(switchControls);
  const id = $props.id()

  const [state, send] = useMachine(switchs.machine({ id }), {
    context: controls.context,
  });

  const api = $derived(switchs.connect(state, send, normalizeProps));
</script>

<label
  {...api.getRootProps()}
  class="switch-root"
>
  <input {...api.getHiddenInputProps()} class="switch-hidden-input" />
  <span
    {...api.getControlProps()}
    class="switch-control"
  >
    <span
      {...api.getThumbProps()}
      class="switch-thumb"
    ></span>
  </span>
  <span
    {...api.getLabelProps()}
    class="switch-label"
  >
    {#if api.checked}
      open
    {:else}
      close
    {/if}
  </span>
</label>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
