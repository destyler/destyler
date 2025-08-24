<script lang="ts">
  import * as colorPicker from '@destyler/color-picker'
  import { normalizeProps, useMachine, portal } from '@destyler/svelte'
  import './index.css'

  const id = $props.id()

  const [state, send] = useMachine(colorPicker.machine({
    id,
    value: colorPicker.parse('hsl(240,5.9%,10%)'),
  }))

  const api = $derived(colorPicker.connect(state, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="color-picker-root">
  <input {...api.getHiddenInputProps()} class="color-picker-hidden-input">
  <div {...api.getControlProps()} class="color-picker-control">
    <button
      {...api.getTriggerProps()}
      class="color-picker-trigger"
    >
      <div {...api.getTransparencyGridProps({ size: '8px' })} class="color-picker-transparency-grid" ></div>
      <div {...api.getSwatchProps({ value: api.value })} class="color-picker-swatch" ></div>
    </button>
    <div class="color-picker-input-container">
      <input
        {...api.getChannelInputProps({ channel: 'hex' })}
        class="color-picker-channel-input color-picker-channel-input-hex"
      >
      <input
        {...api.getChannelInputProps({ channel: 'alpha' })}
        class="color-picker-channel-input color-picker-channel-input-alpha"
      >
    </div>
  </div>

  {#if api.open}
    <div use:portal>
      <div {...api.getPositionerProps()} class="color-picker-positioner">
        <div {...api.getContentProps()} class="color-picker-content">
          <div {...api.getAreaProps()} class="color-picker-area">
            <div {...api.getAreaBackgroundProps()} class="color-picker-area-background" ></div>
            <div {...api.getAreaThumbProps()} class="color-picker-area-thumb" ></div>
          </div>
  
          <div {...api.getChannelSliderProps({ channel: 'hue' })} class="color-picker-channel-slider color-picker-channel-slider-hue">
            <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} class="color-picker-channel-slider-track" ></div>
            <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} class="color-picker-channel-slider-thumb" ></div>
          </div>
  
          <div {...api.getChannelSliderProps({ channel: 'alpha' })} class="color-picker-channel-slider color-picker-channel-slider-alpha">
            <div {...api.getTransparencyGridProps({ size: '8px' })} class="color-picker-transparency-grid" ></div>
            <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} class="color-picker-channel-slider-track" ></div>
            <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} class="color-picker-channel-slider-thumb" ></div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
