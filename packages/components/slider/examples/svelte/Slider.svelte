<script lang="ts">
  import { sliderControls } from "@destyler/shared-private"
  import * as slider from "../../index"
  import { normalizeProps, useMachine } from "@destyler/svelte"
  import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
  import '../style.css'

  const controls = useControls(sliderControls)

  const [snapshot, send] = useMachine(
    slider.machine({
      id: "1",
      name: "quantity",
      value: [0],
    }),
    {
      context: controls.context,
    },
  )

  const api = $derived(slider.connect(snapshot, send, normalizeProps))
</script>

<Layout>
<main class="slider">
  <form>
    <div {...api.getRootProps()}>
      <div>
        <!-- svelte-ignore a11y_label_has_associated_control -->
        <label data-testid="label" {...api.getLabelProps()}> Slider Label </label>
        <output data-testid="output" {...api.getValueTextProps()}>
          {api.value}
        </output>
      </div>
      <div class="control-area">
        <div {...api.getControlProps()}>
          <div data-testid="track" {...api.getTrackProps()}>
            <div {...api.getRangeProps()}></div>
          </div>
          {#each api.value as _, index}
            <div {...api.getThumbProps({ index })}>
              <input {...api.getHiddenInputProps({ index })} />
            </div>
          {/each}
        </div>
        <div {...api.getMarkerGroupProps()}>
          <span {...api.getMarkerProps({ value: 10 })}>*</span>
          <span {...api.getMarkerProps({ value: 30 })}>*</span>
          <span {...api.getMarkerProps({ value: 90 })}>*</span>
        </div>
      </div>
    </div>
  </form>
</main>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>

</Layout>
