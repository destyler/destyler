<script lang="ts">
  import * as progress from "../../index"
  import { progressControls } from "@destyler/shared-private"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(progressControls)

  const id = $props.id()

  const [snapshot, send] = useMachine(progress.machine({
    id
  }), {
    context: controls.context,
  })

  const api = $derived(progress.connect(snapshot, send, normalizeProps))
</script>

<Layout>
  <main>
    <div {...api.getRootProps()}>
      <div {...api.getLabelProps()}>Upload progress</div>

      <svg {...api.getCircleProps()}>
        <circle {...api.getCircleTrackProps()} />
        <circle {...api.getCircleRangeProps()} />
      </svg>

      <div {...api.getTrackProps()}>
        <div {...api.getRangeProps()}></div>
      </div>

      <div {...api.getValueTextProps()}>{api.valueAsString}</div>

      <div>
        <button onclick={() => api.setValue((api.value ?? 0) - 20)}>Decrease</button>
        <button onclick={() => api.setValue((api.value ?? 0) + 20)}>Increase</button>
        <button onclick={() => api.setValue(null)}>Indeterminate</button>
      </div>
    </div>
  </main>

  <Toolbar {controls}>
    <StateVisualizer state={snapshot} />
  </Toolbar>
</Layout>
