<script lang="ts">
import * as colorPicker from '../../index'
import { normalizeProps, useMachine } from '@destyler/svelte'
import { colorPickerControls } from '@destyler/shared-private'
import {useControls, Toolbar, StateVisualizer, Layout} from '@destyler/shared-private/svelte'
import '../style.css'

const presets = ["#f47373", "#697689"]

const controls = useControls(colorPickerControls)

const id = $props.id();

const [snapshot, send] = useMachine(
  colorPicker.machine({
    id: id,
    name: "color",
    format: "hsla",
    value: colorPicker.parse("hsl(0, 100%, 50%)"),
  }),
  {
    context: controls.context,
  },
)
const api = $derived(colorPicker.connect(snapshot, send, normalizeProps))
</script>

<Layout>
<main class="color-picker">
  <form>
    <input {...api.getHiddenInputProps()} />
    <div {...api.getRootProps()}>
      <label {...api.getLabelProps()}>
        Select Color: <span data-testid="value-text">{api.valueAsString}</span>
      </label>

      <div {...api.getControlProps()}>
        <button {...api.getTriggerProps()}>
          <div {...api.getTransparencyGridProps({ size: "10px" })}></div>
          <div {...api.getSwatchProps({ value: api.value })}></div>
        </button>
        <input {...api.getChannelInputProps({ channel: "hex" })} />
        <input {...api.getChannelInputProps({ channel: "alpha" })} />
      </div>

      <div {...api.getPositionerProps()}>
        <div {...api.getContentProps()}>
          <div class="content__inner">
            <div {...api.getAreaProps()}>
              <div {...api.getAreaBackgroundProps()}></div>
              <div {...api.getAreaThumbProps()}></div>
            </div>

            <div {...api.getChannelSliderProps({ channel: "hue" })}>
              <div {...api.getChannelSliderTrackProps({ channel: "hue" })}></div>
              <div {...api.getChannelSliderThumbProps({ channel: "hue" })}></div>
            </div>

            <div {...api.getChannelSliderProps({ channel: "alpha" })}>
              <div {...api.getTransparencyGridProps({ size: "12px" })}></div>
              <div {...api.getChannelSliderTrackProps({ channel: "alpha" })}></div>
              <div {...api.getChannelSliderThumbProps({ channel: "alpha" })}></div>
            </div>

            {#if api.format.startsWith("hsl")}
              <div style="display:flex;width:100%;">
                <span>H</span> <input {...api.getChannelInputProps({ channel: "hue" })} />
                <span>S</span> <input {...api.getChannelInputProps({ channel: "saturation" })} />
                <span>L</span> <input {...api.getChannelInputProps({ channel: "lightness" })} />
                <span>A</span> <input {...api.getChannelInputProps({ channel: "alpha" })} />
              </div>
            {/if}

            {#if api.format.startsWith("rgb")}
              <div style="display:flex;width:100%;">
                <span>R</span> <input {...api.getChannelInputProps({ channel: "red" })} />
                <span>G</span> <input {...api.getChannelInputProps({ channel: "green" })} />
                <span>B</span> <input {...api.getChannelInputProps({ channel: "blue" })} />
                <span>A</span> <input {...api.getChannelInputProps({ channel: "alpha" })} />
              </div>
            {/if}

            {#if api.format.startsWith("hsb")}
              <div style="display:flex;width:100%;">
                <span>H</span> <input {...api.getChannelInputProps({ channel: "hue" })} />
                <span>S</span> <input {...api.getChannelInputProps({ channel: "saturation" })} />
                <span>B</span> <input {...api.getChannelInputProps({ channel: "brightness" })} />
                <span>A</span> <input {...api.getChannelInputProps({ channel: "alpha" })} />
              </div>
            {/if}

            <div style="display:flex;gap:10px;align-items:center;">
              <div style="position:relative;">
                <div {...api.getTransparencyGridProps({ size: "4px" })}></div>
                <div {...api.getSwatchProps({ value: api.value })}></div>
              </div>
              <p data-testid="value-text">{api.valueAsString}</p>
            </div>

            <input {...api.getChannelInputProps({ channel: "hex" })} />

            <div {...api.getSwatchGroupProps()} style="display:flex;gap:10px;">
              {#each presets as preset}
                <button {...api.getSwatchTriggerProps({ value: preset })}>
                  <div style="position:relative;">
                    <div {...api.getTransparencyGridProps({ size: "4px" })}></div>
                    <div {...api.getSwatchProps({ value: preset })}></div>
                  </div>
                </button>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</main>

<Toolbar {controls}>
  <StateVisualizer state={snapshot} />
</Toolbar>
</Layout>
