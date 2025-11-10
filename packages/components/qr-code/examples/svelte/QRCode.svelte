<script lang="ts">
  import * as qrCode from "../../index"
  import { useMachine, normalizeProps } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import { qrCodeControls } from "@destyler/shared-private"
  import '../style.css'

  const controls = useControls(qrCodeControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(
    qrCode.machine({
      id,
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(qrCode.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <svg {...api.getFrameProps()}>
        <path {...api.getPatternProps()} />
      </svg>
      <div {...api.getOverlayProps()}>
        <img src="https://avatars.githubusercontent.com/u/143371546?s=88&v=4" alt="" />
      </div>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
