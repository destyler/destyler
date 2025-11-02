<script lang="ts">
  import * as menu from "../../index"
  import { menuControls } from "@destyler/shared-private"
  import { normalizeProps, portal, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(menuControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(menu.machine({ id: id, onSelect: console.log }), {
    context: controls.context,
  })

  const api = $derived(menu.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <button {...api.getTriggerProps()}>
      Actions <span {...api.getIndicatorProps()}>▾</span>
    </button>
    <div use:portal {...api.getPositionerProps()}>
      <ul {...api.getContentProps()}>
        <li {...api.getItemProps({ value: "edit" })}>Edit</li>
        <li {...api.getItemProps({ value: "duplicate" })}>Duplicate</li>
        <li {...api.getItemProps({ value: "delete" })}>Delete</li>
        <li {...api.getItemProps({ value: "export" })}>Export...</li>
      </ul>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>

</Layout>
