<script lang="ts">
  import * as colorPicker from '@destyler/color-picker'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import '@docs/styles/components/color-picker.css'

  const id = $props.id()

  const [state, send] = useMachine(colorPicker.machine({
    id,
    value: colorPicker.parse('hsl(240,5.9%,10%)'),
  }))

  const api = $derived(colorPicker.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} >
  <input {...api.getHiddenInputProps()}>
  <div {...api.getControlProps()} >
    <button {...api.getTriggerProps()}>
      <div {...api.getTransparencyGridProps({ size: '8px' })} ></div>
      <div {...api.getSwatchProps({ value: api.value })} ></div>
    </button>
    <div class="flex flex-col gap-1.5 mt-0!">
      <input {...api.getChannelInputProps({ channel: 'hex' })}>
      <input {...api.getChannelInputProps({ channel: 'alpha' })} >
    </div>
  </div>

  {#if api.open}
    <div use:portal>
      <div data-layout="sinppets" {...api.getPositionerProps()}>
        <div {...api.getContentProps()} >
          <div {...api.getAreaProps()} >
            <div {...api.getAreaBackgroundProps()} ></div>
            <div {...api.getAreaThumbProps()} ></div>
          </div>

          <div {...api.getChannelSliderProps({ channel: 'hue' })}>
            <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} ></div>
            <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} ></div>
          </div>

          <div {...api.getChannelSliderProps({ channel: 'alpha' })} >
            <div {...api.getTransparencyGridProps({ size: '8px' })} ></div>
            <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} ></div>
            <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} ></div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
