<script lang="ts">
  import * as colorPicker from '@destyler/color-picker'
  import { colorPickerControls } from '@destyler/shared-private'
  import { normalizeProps, useMachine } from '@destyler/svelte'

  import {useControls, Toolbar, StateVisualizer} from '@destyler/shared-private/svelte'
  import '@destyler/shared-private/styles/color-picker.css'

  const controls = useControls(colorPickerControls)
  const id = $props.id()

  const [snapshot, send] = useMachine(colorPicker.machine({
    id,
    name: 'color',
    format: 'hsla',
    value: colorPicker.parse('hsl(0, 100%, 50%)'),
  }), {
    context: controls.context,
  })

  const api = $derived(colorPicker.connect(snapshot, send, normalizeProps))
</script>

<div {...api.getRootProps()} class="color-picker-root">
  <label {...api.getLabelProps()} class="color-picker-label">
    Select Color: <span data-testid="value-text">{api.valueAsString}</span>
  </label>
  <input {...api.getHiddenInputProps()}>
  <div {...api.getControlProps()} class="color-picker-control">
    <button {...api.getTriggerProps()} class="color-picker-trigger">
      <div {...api.getTransparencyGridProps({ size: '10px' })} class="color-picker-transparency-grid" ></div>
      <div {...api.getSwatchProps({ value: api.value })} class="color-picker-swatch" ></div>
    </button>
    <div class="color-picker-input-box">
      <input
        {...api.getChannelInputProps({ channel: 'hex' })}
        class="color-picker-channel-input"
      >
      <input
        {...api.getChannelInputProps({ channel: 'alpha' })}
        class="color-picker-channel-input"
      >
    </div>
  </div>

  <div {...api.getPositionerProps()} class="color-picker-positioner">
    <div {...api.getContentProps()} class="color-picker-content">
      <div {...api.getAreaProps()} class="color-picker-area">
        <div {...api.getAreaBackgroundProps()} class="color-picker-area-background" ></div>
        <div {...api.getAreaThumbProps()} class="color-picker-area-thumb" ></div>
      </div>

      <div {...api.getChannelSliderProps({ channel: 'hue' })} class="color-picker-hue-slider">
        <div {...api.getChannelSliderTrackProps({ channel: 'hue' })} class="color-picker-hue-slider-track" ></div>
        <div {...api.getChannelSliderThumbProps({ channel: 'hue' })} class="color-picker-hue-slider-thumb" ></div>
      </div>

      <div {...api.getChannelSliderProps({ channel: 'alpha' })} class="color-picker-alpha-slider">
        <div {...api.getTransparencyGridProps({ size: '12px' })} class="color-picker-alpha-grid" ></div>
        <div {...api.getChannelSliderTrackProps({ channel: 'alpha' })} class="color-picker-alpha-slider-track" ></div>
        <div {...api.getChannelSliderThumbProps({ channel: 'alpha' })} class="color-picker-alpha-slider-thumb" ></div>
      </div>
    </div>
  </div>
</div>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
