<script lang="ts">
  import * as slider from '@destyler/slider'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()
  const [state, send] = useMachine(slider.machine({ id, value: [60] }))
  const api = $derived(slider.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="slider-root">
  <div {...api.getControlProps()} class="slider-control">
    <div
      {...api.getTrackProps()}
      class="slider-track"
    >
      <div
        {...api.getRangeProps()}
        class="slider-range"
      >
      </div>
    </div>
    {#each api.value as _, index (index)}
      <div
        {...api.getThumbProps({ index })}
        class="slider-thumb"
      >
        <input {...api.getHiddenInputProps({ index })}>
      </div>
    {/each}
  </div>
</div>

<style>
  @import './index.css';
</style>
