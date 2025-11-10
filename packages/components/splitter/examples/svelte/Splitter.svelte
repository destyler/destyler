<script lang="ts">
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import { splitterControls } from "@destyler/shared-private"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import * as splitter from "../../index"
  import '../style.css'

  const controls = useControls(splitterControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(
    splitter.machine({
      id: id,
      size: [
        { id: "a", size: 50 },
        { id: "b", size: 50 },
      ],
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(splitter.connect(snapshot, send, normalizeProps))
</script>

<Layout>
<main style="min-width: 400px;min-height: 200px;" >
  <div {...api.getRootProps()}>
    <div {...api.getPanelProps({ id: "a" })}>
      <p>A</p>
    </div>
    <div {...api.getResizeTriggerProps({ id: "a:b" })}></div>
    <div {...api.getPanelProps({ id: "b" })}>
      <p>B</p>
    </div>
  </div>
</main>

<Toolbar {controls} viz>
  <StateVisualizer state={snapshot} omit={["previousPanels", "initialSize"]} />
</Toolbar>
</Layout>
