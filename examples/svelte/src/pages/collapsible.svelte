<script lang="ts">
  import * as collapsible from '@destyler/collapsible'
  import { collapsibleControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/collapsible.css'

  const controls = useControls(collapsibleControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(collapsible.machine({ id }), {
    context: controls.context,
  })

  const api = $derived(collapsible.connect(snapshot, send, normalizeProps))
</script>

<div
  class="collapsible-root"
  {...api.getRootProps()}
>
  <button
    class="group collapsible-trigger"
    {...api.getTriggerProps()}
  >
    <span>Toggle Content</span>
    <div
      class="collapsible-trigger-icon"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 32 32"><!-- Icon from Carbon by IBM - undefined --><path fill="currentColor" d="M16 22L6 12l1.4-1.4l8.6 8.6l8.6-8.6L26 12z" /></svg>
    </div>
  </button>

  <div
    class="content"
    {...api.getContentProps()}
  >
    <div class="p-4 leading-relaxed">
      <p class="desc">
        This is a collapsible demo content. You can place any content here that you want to show or hide.
      </p>
      <p class="desc">
        Click the button above to toggle the content state.
      </p>
    </div>
  </div>
</div>

  <div>
    <div>Toggle Controls</div>
    <button class="button" onclick={()=>api.setOpen(true)}>
      Open
    </button>
    <button class="button" onclick={()=>api.setOpen(false)}>
      Close
    </button>
  </div>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
