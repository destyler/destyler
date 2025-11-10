<script lang="ts">
  import { signatureControls } from "@destyler/shared-private"
  import * as signaturePad from "../../index"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(signatureControls)

  let url = $state("")
  const setUrl = (value: string) => (url = value)

  const [snapshot, send] = useMachine(
    signaturePad.machine({
      id: "1",
      onDrawEnd(details) {
        details.getDataUrl("image/png").then(setUrl)
      },
      drawing: {
        fill: "red",
        size: 4,
        simulatePressure: true,
      },
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(signaturePad.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main >
    <div {...api.getRootProps()}>
      <!-- svelte-ignore a11y_label_has_associated_control -->
      <label {...api.getLabelProps()}>Signature Pad</label>

      <div {...api.getControlProps()}>
        <svg {...api.getSegmentProps()}>
          {#each api.paths as path}
            <path {...api.getSegmentPathProps({ path })} />
          {/each}
          {#if api.currentPath}
            <path {...api.getSegmentPathProps({ path: api.currentPath })} />
          {/if}
        </svg>

        <div {...api.getGuideProps()}></div>
      </div>

      <button {...api.getClearTriggerProps()}>
        x
      </button>
    </div>

    <button
      onclick={() => {
        api.getDataUrl("image/png").then(setUrl)
      }}
    >
      Show Image
    </button>

    {#if url}
      <img data-part="preview" alt="signature" src={url} />
    {/if}
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} omit={["currentPoints", "currentPath", "paths"]} />
  </Toolbar>
</Layout>
