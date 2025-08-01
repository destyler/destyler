<script lang="ts">
  import '@destyler/shared-private/styles/slider.css';
  import * as slider from "@destyler/slider";
  import { normalizeProps, useMachine } from "@destyler/svelte";
  import { sliderControls } from '@destyler/shared-private';
  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'

  const controls = useControls(sliderControls);

  const [state, send] = useMachine(slider.machine({
    id: crypto.randomUUID(),
    value: [12]
  }), {
    context: controls.context
  });

  const api = $derived(slider.connect(state, send, normalizeProps));
</script>

<div {...api.getRootProps()} class="slider-root">
  <div class="slider-header">
    <label {...api.getLabelProps()} class="slider-label">
      Slider Value
    </label>
    <output {...api.getValueTextProps()} class="slider-value-text">
      {api.value[0]}
    </output>
  </div>
  <div {...api.getControlProps()} class="slider-control">
    <div
      {...api.getTrackProps()}
      class="slider-track"
    >
      <div
        {...api.getRangeProps()}
        class="slider-range"
      ></div>
    </div>
    {#each api.value as _, index (index)}
      <div
        {...api.getThumbProps({ index })}
        class="slider-thumb"
      >
        <input {...api.getHiddenInputProps({ index })} class="slider-hidden-input" />
      </div>
    {/each}
  </div>
</div>
<Toolbar {controls}>
  <StateVisualizer state={state} />
</Toolbar>
