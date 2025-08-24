<script lang="ts">
  import * as slider from '@destyler/slider'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  const id = $props.id()
  const [state, send] = useMachine(slider.machine({ id, value: [60] }))
  const api = $derived(slider.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="flex touch-none w-full! select-none items-center">
  <div {...api.getControlProps()} class="w-full relative">
    <div
      {...api.getTrackProps()}
      class="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
    >
      <div
        {...api.getRangeProps()}
        class="absolute h-full bg-primary"
      >
      </div>
    </div>
    {#each api.value as _, index (index)}
      <div
        {...api.getThumbProps({ index })}
        class="absolute top--1.5 cursor-pointer block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        <input {...api.getHiddenInputProps({ index })}>
      </div>
    {/each}
  </div>
</div>
