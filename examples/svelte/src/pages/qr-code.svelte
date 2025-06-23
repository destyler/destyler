<script lang="ts">
  import * as qrCode from "@destyler/qr-code"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import Toolbar from '../components/toolbar.svelte'
  import StateVisualizer from "../components/state-visualizer.svelte"
  import {useControls} from '../hooks/use-controls.svelte'
  import { qrCodeControls } from '@destyler/shared-private-private'

  const controls = useControls(qrCodeControls)

  const id = $props.id()

  const [state, send] = useMachine(
    qrCode.machine({
      id
    }),
    {
      context: controls.context
    }
  )

  const api = $derived(qrCode.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="w-270px h-270px">
  <svg {...api.getFrameProps()} class="w-270px h-270px">
    <path {...api.getPatternProps()} />
  </svg>
  <div {...api.getOverlayProps()} class="w-50px h-50px">
    <img
      src="https://github.com/destyler.png"
      alt=""
    />
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
