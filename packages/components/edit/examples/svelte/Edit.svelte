<script lang="ts">
  import * as edit from "../../index";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { editControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const id = $props.id()

  const controls = useControls(editControls);

  const [state, send] = useMachine(edit.machine({
    id: id,
    value: 'Hello World',
  }),{
    context: controls.context,
  })

  const api = $derived(edit.connect(state, send, normalizeProps));
</script>

<Layout>
  <main>
    <div {...api.getRootProps()} >
      <div {...api.getAreaProps()} >
        <input {...api.getInputProps()} />
        <span {...api.getPreviewProps()}>{api.valueText}</span>
      </div>
      <div>
        {#if api.editing}
          <button {...api.getSubmitTriggerProps()} >
            Save
          </button>
          <button {...api.getCancelTriggerProps()} >
            Cancel
          </button>
        {:else}
          <button {...api.getEditTriggerProps()}>
            Edit
          </button>
        {/if}
      </div>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={state} />
  </Toolbar>

</Layout>
