<script lang="ts">
  import * as colorPicker from '@destyler/color-picker'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'

  const id = $props.id()

  const [state, send] = useMachine(colorPicker.machine({
    id,
    value: colorPicker.parse('hsl(240,5.9%,10%)'),
  }))

  const api = $derived(colorPicker.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="mt-0!">
  <input {...api.getHiddenInputProps()}>
  <div {...api.getControlProps()} class="flex items-center gap-3 mt-1.5!">
    <button
      {...api.getTriggerProps()}
      class="relative flex justify-center items-center size-16 border border-border rounded-md overflow-hidden outline-none transition-colors"
    >
      <div {...api.getTransparencyGridProps({ size: '8px' })} class="absolute inset-0 bg-transparent! [background-image:none]!" ></div>
      <div {...api.getSwatchProps({ value: api.value })} class="absolute mt-0! inset-0 w-full h-full bg-[--color]" ></div>
    </button>
    <div class="flex flex-col gap-1.5 mt-0!">
      <input
        {...api.getChannelInputProps({ channel: 'hex' })}
        class="flex h-8 w-32 rounded-md text-primary! border border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
      <input
        {...api.getChannelInputProps({ channel: 'alpha' })}
        class="flex h-8 w-32 rounded-md text-primary! border border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
    </div>
  </div>

  {#if api.open}
    <div use:portal>
      <div {...api.getPositionerProps()} class="fixed mt-2 z-180!">
        <div {...api.getContentProps()} class="rounded-md border border-input bg-popover p-3 text-popover-foreground shadow-md outline-none">
          <div {...api.getAreaProps()} class="relative w-48 h-32 mb-3">
            <div {...api.getAreaBackgroundProps()} class="absolute inset-0 rounded-md w-full h-full" ></div>
            <div {...api.getAreaThumbProps()} class="absolute w-3 h-3 -translate-x-1.5 -translate-y-1.5 border-2 border-white rounded-full shadow-sm cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" ></div>
          </div>
  
          <div {...api.getChannelSliderProps({ channel: 'hue' })} class="relative h-4 mb-3">
            <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} class="absolute inset-0 rounded-md h-full" ></div>
            <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} class="absolute w-2 h-4 border border-dark dark:border-light -translate-x-1 bg-background rounded-sm shadow-sm cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" ></div>
          </div>
  
          <div {...api.getChannelSliderProps({ channel: 'alpha' })} class="relative h-4">
            <div {...api.getTransparencyGridProps({ size: '8px' })} class="absolute inset-0 rounded-md" ></div>
            <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} class="absolute inset-0 rounded-md h-full" ></div>
            <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} class="absolute w-2 h-4 border border-dark dark:border-light -translate-x-1 bg-background rounded-sm shadow-sm cursor-pointer ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" ></div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
