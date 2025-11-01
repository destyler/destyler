<script lang="ts">
import * as dialog from '../../index'
import { normalizeProps, useMachine, portal } from '@destyler/svelte'
import { dialogControls } from '@destyler/shared-private'
import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
import '../style.css'

const controls = useControls(dialogControls)

const uid = $props.id();

const [state, send] = useMachine(dialog.machine({
  id: uid,
}),{
  context:controls.context
})
const api = $derived(dialog.connect(state, send, normalizeProps))
</script>

<Layout>
  <main>
    <button {...api.getTriggerProps()}> Click me</button>
    {#if api.open}
      <div use:portal {...api.getBackdropProps()}></div>
      <div use:portal {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          <h2 {...api.getTitleProps()}>Edit profile</h2>
          <p {...api.getDescriptionProps()}>Make changes to your profile here. Click save when you are done.</p>
          <div>
            <input placeholder="Enter name..." />
            <button>Save</button>
          </div>
          <button {...api.getCloseTriggerProps()}>x</button>
        </div>
      </div>
    {/if}
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>
</Layout>
