<script lang="ts">
  import * as slider from '@destyler/slider'
  import { normalizeProps, useMachine } from '@destyler/svelte'
  import '../../styles/components/slider.css'

  const { className = '' } = $props()

  const id = $props.id()
  const [state, send] = useMachine(slider.machine({ id, value: [60] }))
  const api = $derived(slider.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class={`${className}`}>
  <div {...api.getControlProps()}>
    <div {...api.getTrackProps()}>
      <div {...api.getRangeProps()}>
      </div>
    </div>
    {#each api.value as _, index (index)}
      <div {...api.getThumbProps({ index })}>
        <input {...api.getHiddenInputProps({ index })}>
      </div>
    {/each}
  </div>
</div>
