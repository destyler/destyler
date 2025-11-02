<script lang="ts">
  import * as fileUpload from "../../index"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { fileUploadControls } from '@destyler/shared-private'
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(fileUploadControls)

  const id = $props.id()

  const [state, send] = useMachine(fileUpload.machine({ id }), {
    context: controls.context,
  })

  const api = $derived(fileUpload.connect(state, send, normalizeProps))
</script>

<Layout>
  <div {...api.getRootProps()}>
    <div {...api.getDropzoneProps()}>
      <input {...api.getHiddenInputProps()} />
      <p>Drag and drop your files here</p>
      <p>or</p>
      <button {...api.getTriggerProps()}>
        Choose Files...
      </button>
    </div>

    <ul {...api.getItemGroupProps()}>
      {#each api.acceptedFiles as file (file.name)}
        <li {...api.getItemProps({ file })}>
          <div {...api.getItemNameProps({ file })}>
            {file.name}
          </div>
          <button {...api.getItemDeleteTriggerProps({ file })}>
            Delete
          </button>
        </li>
      {/each}
    </ul>
  </div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
</Layout>
