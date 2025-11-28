import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { colorPickerControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as colorPicker from '../../index'
import styles from '../style.css?inline'

const presets = ['#f47373', '#697689'] as const

type ColorPickerMachineContext = ContextFrom<typeof colorPicker.machine>

@customElement('destyler-color-picker')
export class ColorPickerElement extends LitElement {
  private controls = new ControlsController(colorPickerControls)

  private machine = new MachineController(
    this,
    colorPicker.machine({
      id: 'color-picker:lit',
      name: 'color',
      format: 'hsla',
      value: colorPicker.parse('hsl(0, 100%, 50%)'),
    }),
    {
      context: {
        get: () => this.controls.context as Partial<ColorPickerMachineContext>,
        subscribe: (fn: (ctx: Partial<ColorPickerMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = colorPicker.connect(this.machine.state, this.machine.send, normalizeProps)
    const format = api.format

    return html`
    <destyler-layout>
      <main class="color-picker">
        <form>
          <input ${spread(api.getHiddenInputProps())} />
          <div ${spread(api.getRootProps())}>
            <label ${spread(api.getLabelProps())}>
              Select Color:
              <span data-testid="value-text">${api.valueAsString}</span>
            </label>

            <div ${spread(api.getControlProps())}>
              <button ${spread(api.getTriggerProps())}>
                <div ${spread(api.getTransparencyGridProps({ size: '10px' }))}></div>
                <div ${spread(api.getSwatchProps({ value: api.value }))}></div>
              </button>
              <input ${spread(api.getChannelInputProps({ channel: 'hex' }))} />
              <input ${spread(api.getChannelInputProps({ channel: 'alpha' }))} />
            </div>

            <div ${spread(api.getPositionerProps())}>
              <div ${spread(api.getContentProps())}>
                <div class="content__inner">
                  <div ${spread(api.getAreaProps())}>
                    <div ${spread(api.getAreaBackgroundProps())}></div>
                    <div ${spread(api.getAreaThumbProps())}></div>
                  </div>

                  <div ${spread(api.getChannelSliderProps({ channel: 'hue' }))}>
                    <div ${spread(api.getChannelSliderTrackProps({ channel: 'hue' }))}></div>
                    <div ${spread(api.getChannelSliderThumbProps({ channel: 'hue' }))}></div>
                  </div>

                  <div ${spread(api.getChannelSliderProps({ channel: 'alpha' }))}>
                    <div ${spread(api.getTransparencyGridProps({ size: '12px' }))}></div>
                    <div ${spread(api.getChannelSliderTrackProps({ channel: 'alpha' }))}></div>
                    <div ${spread(api.getChannelSliderThumbProps({ channel: 'alpha' }))}></div>
                  </div>

                  ${format.startsWith('hsl')
                    ? html`<div style="display: flex; width: 100%;">
                      <span>H</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'hue' }))} />
                      <span>S</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'saturation' }))} />
                      <span>L</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'lightness' }))} />
                      <span>A</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'alpha' }))} />
                    </div>`
                    : null}

                  ${format.startsWith('rgb')
                    ? html`<div style="display: flex; width: 100%;">
                      <span>R</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'red' }))} />
                      <span>G</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'green' }))} />
                      <span>B</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'blue' }))} />
                      <span>A</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'alpha' }))} />
                    </div>`
                    : null}

                  ${format.startsWith('hsb')
                    ? html`<div style="display: flex; width: 100%;">
                      <span>H</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'hue' }))} />
                      <span>S</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'saturation' }))} />
                      <span>B</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'brightness' }))} />
                      <span>A</span>
                      <input ${spread(api.getChannelInputProps({ channel: 'alpha' }))} />
                    </div>`
                    : null}

                  <div style="display: flex; gap: 10px; align-items: center;">
                    <div style="position: relative;">
                      <div ${spread(api.getTransparencyGridProps({ size: '4px' }))}></div>
                      <div ${spread(api.getSwatchProps({ value: api.value }))}></div>
                    </div>
                    <p data-testid="value-text">${api.valueAsString}</p>
                  </div>

                  <input ${spread(api.getChannelInputProps({ channel: 'hex' }))} />

                  <div ${spread(api.getSwatchGroupProps())} style="display: flex; gap: 10px;">
                    ${presets.map(preset => html`<button ${spread(api.getSwatchTriggerProps({ value: preset }))}>
                      <div style="position: relative;">
                        <div ${spread(api.getTransparencyGridProps({ size: '4px' }))}></div>
                        <div ${spread(api.getSwatchProps({ value: preset }))}></div>
                      </div>
                    </button>`)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </main>

      <destyler-toolbar .controls=${this.controls}>
        <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
      </destyler-toolbar>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-color-picker': ColorPickerElement
  }
}
