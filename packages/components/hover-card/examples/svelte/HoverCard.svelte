<script lang="ts">
  import * as hoverCard from "../../index"
  import { hoverCardControls } from "@destyler/shared-private"
  import { normalizeProps, portal, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(hoverCardControls)

  const [snapshot, send] = useMachine(hoverCard.machine({ id: "1" }), {
    context: controls.context,
  })

  const api = $derived(hoverCard.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <div style="display:flex; gap:50px">
      <a href="https://twitter.com/zag_js" target="_blank" {...api.getTriggerProps()}> Twitter </a>

      {#if api.open}
        <div use:portal {...api.getPositionerProps()}>
          <div {...api.getContentProps()}>
            <div {...api.getArrowProps()}>
              <div {...api.getArrowTipProps()}></div>
            </div>
            Twitter Preview
            <a href="https://twitter.com/zag_js" target="_blank"> Twitter </a>
          </div>
        </div>
      {/if}

      <div data-part="test-text">Test text</div>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
