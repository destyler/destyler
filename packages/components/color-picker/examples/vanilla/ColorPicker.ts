import type { ContextFrom } from '@destyler/vanilla'
import { colorPickerControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as colorPicker from '../../index'
import '../style.css'

const presets = ['#f47373', '#697689'] as const

type ChannelName = Parameters<colorPicker.Api['getChannelInputProps']>[0]['channel']
type ColorPickerMachineContext = ContextFrom<typeof colorPicker.machine>
type ColorPickerService = ReturnType<typeof colorPicker.machine>
type ColorPickerState = ReturnType<ColorPickerService['getState']>
type ColorPickerSnapshot = Parameters<typeof colorPicker.connect>[0]

class ColorPickerExample extends Component<
  colorPicker.Context,
  colorPicker.Api,
  ColorPickerMachineContext
> {
  private readonly hiddenInput: HTMLInputElement | null
  private readonly rootNode: HTMLElement | null
  private readonly labelEl: HTMLLabelElement | null
  private readonly valueTextEls: HTMLElement[]
  private readonly controlEl: HTMLElement | null
  private readonly triggerEl: HTMLButtonElement | null
  private readonly triggerGridEl: HTMLElement | null
  private readonly triggerSwatchEl: HTMLElement | null
  private readonly topHexInput: HTMLInputElement | null
  private readonly topAlphaInput: HTMLInputElement | null
  private readonly positionerEl: HTMLElement | null
  private readonly contentEl: HTMLElement | null
  private readonly areaEl: HTMLElement | null
  private readonly areaBackgroundEl: HTMLElement | null
  private readonly areaThumbEl: HTMLElement | null
  private readonly hueSliderEl: HTMLElement | null
  private readonly hueTrackEl: HTMLElement | null
  private readonly hueThumbEl: HTMLElement | null
  private readonly alphaSliderEl: HTMLElement | null
  private readonly alphaGridEl: HTMLElement | null
  private readonly alphaTrackEl: HTMLElement | null
  private readonly alphaThumbEl: HTMLElement | null
  private readonly formatGroups: Array<{ type: 'hsl' | 'rgb' | 'hsb', container: HTMLElement | null, inputs: Array<{ channel: ChannelName, element: HTMLInputElement | null }> }>
  private readonly contentHexInput: HTMLInputElement | null
  private readonly displayGridEl: HTMLElement | null
  private readonly displaySwatchEl: HTMLElement | null
  private readonly swatchGroupEl: HTMLElement | null
  private readonly swatchButtons: Array<{ value: string, button: HTMLButtonElement, gridEl: HTMLElement | null, swatchEl: HTMLElement | null }>
  private readonly stateListeners = new Set<(state: ColorPickerState) => void>()

  constructor(rootEl: HTMLElement, context: colorPicker.Context, options?: any) {
    super(rootEl, context, options)
    this.hiddenInput = rootEl.querySelector('[data-color-picker-hidden]')
    this.rootNode = rootEl.querySelector('[data-color-picker-root]')
    this.labelEl = rootEl.querySelector('[data-color-picker-label]')
    this.valueTextEls = Array.from(rootEl.querySelectorAll('[data-color-picker-value-text]'))
    this.controlEl = rootEl.querySelector('[data-color-picker-control]')
    this.triggerEl = rootEl.querySelector('[data-color-picker-trigger]')
    this.triggerGridEl = this.triggerEl?.querySelector('[data-color-picker-trigger-grid]') ?? null
    this.triggerSwatchEl = this.triggerEl?.querySelector('[data-color-picker-trigger-swatch]') ?? null
    this.topHexInput = rootEl.querySelector('[data-color-picker-input="hex"]')
    this.topAlphaInput = rootEl.querySelector('[data-color-picker-input="alpha"]')
    this.positionerEl = rootEl.querySelector('[data-color-picker-positioner]')
    this.contentEl = rootEl.querySelector('[data-color-picker-content]')
    this.areaEl = rootEl.querySelector('[data-color-picker-area]')
    this.areaBackgroundEl = rootEl.querySelector('[data-color-picker-area-background]')
    this.areaThumbEl = rootEl.querySelector('[data-color-picker-area-thumb]')
    this.hueSliderEl = rootEl.querySelector('[data-color-picker-slider="hue"]')
    this.hueTrackEl = rootEl.querySelector('[data-color-picker-slider-track="hue"]')
    this.hueThumbEl = rootEl.querySelector('[data-color-picker-slider-thumb="hue"]')
    this.alphaSliderEl = rootEl.querySelector('[data-color-picker-slider="alpha"]')
    this.alphaGridEl = rootEl.querySelector('[data-color-picker-slider-grid="alpha"]')
    this.alphaTrackEl = rootEl.querySelector('[data-color-picker-slider-track="alpha"]')
    this.alphaThumbEl = rootEl.querySelector('[data-color-picker-slider-thumb="alpha"]')

    const hslGroup = rootEl.querySelector<HTMLElement>('[data-color-picker-group="hsl"]')
    const rgbGroup = rootEl.querySelector<HTMLElement>('[data-color-picker-group="rgb"]')
    const hsbGroup = rootEl.querySelector<HTMLElement>('[data-color-picker-group="hsb"]')

    const mapInputs = (group: HTMLElement | null, channels: ChannelName[]) => (
      channels.map((channel, index) => {
        const input = group ? group.querySelectorAll('input')[index] ?? null : null
        return {
          channel,
          element: input as HTMLInputElement | null,
        }
      })
    )

    this.formatGroups = [
      { type: 'hsl', container: hslGroup, inputs: mapInputs(hslGroup, ['hue', 'saturation', 'lightness', 'alpha']) },
      { type: 'rgb', container: rgbGroup, inputs: mapInputs(rgbGroup, ['red', 'green', 'blue', 'alpha']) },
      { type: 'hsb', container: hsbGroup, inputs: mapInputs(hsbGroup, ['hue', 'saturation', 'brightness', 'alpha']) },
    ]

    this.contentHexInput = rootEl.querySelector('[data-color-picker-content-hex]')
    this.displayGridEl = rootEl.querySelector('[data-color-picker-display-grid]')
    this.displaySwatchEl = rootEl.querySelector('[data-color-picker-display-swatch]')
    this.swatchGroupEl = rootEl.querySelector('[data-color-picker-swatch-group]')
    this.swatchButtons = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('[data-color-picker-swatch-trigger]')).map(button => ({
      value: button.dataset.value ?? '',
      button,
      gridEl: button.querySelector('[data-color-picker-swatch-grid]'),
      swatchEl: button.querySelector('[data-color-picker-swatch]'),
    }))
  }

  initService(context: colorPicker.Context) {
    return colorPicker.machine(context)
  }

  initApi() {
    return colorPicker.connect(this.service.state as ColorPickerSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: ColorPickerState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: ColorPickerState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.hiddenInput)
      spreadProps(this.hiddenInput, api.getHiddenInputProps())

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())

    this.valueTextEls.forEach((node) => {
      node.textContent = api.valueAsString
    })

    if (this.controlEl)
      spreadProps(this.controlEl, api.getControlProps())

    if (this.triggerEl)
      spreadProps(this.triggerEl, api.getTriggerProps())

    if (this.triggerGridEl)
      spreadProps(this.triggerGridEl, api.getTransparencyGridProps({ size: '10px' }))

    if (this.triggerSwatchEl)
      spreadProps(this.triggerSwatchEl, api.getSwatchProps({ value: api.value }))

    if (this.topHexInput)
      spreadProps(this.topHexInput, api.getChannelInputProps({ channel: 'hex' }))

    if (this.topAlphaInput)
      spreadProps(this.topAlphaInput, api.getChannelInputProps({ channel: 'alpha' }))

    if (this.positionerEl)
      spreadProps(this.positionerEl, api.getPositionerProps())

    if (this.contentEl)
      spreadProps(this.contentEl, api.getContentProps())

    if (this.areaEl)
      spreadProps(this.areaEl, api.getAreaProps())

    if (this.areaBackgroundEl)
      spreadProps(this.areaBackgroundEl, api.getAreaBackgroundProps())

    if (this.areaThumbEl)
      spreadProps(this.areaThumbEl, api.getAreaThumbProps())

    if (this.hueSliderEl)
      spreadProps(this.hueSliderEl, api.getChannelSliderProps({ channel: 'hue' }))

    if (this.hueTrackEl)
      spreadProps(this.hueTrackEl, api.getChannelSliderTrackProps({ channel: 'hue' }))

    if (this.hueThumbEl)
      spreadProps(this.hueThumbEl, api.getChannelSliderThumbProps({ channel: 'hue' }))

    if (this.alphaSliderEl)
      spreadProps(this.alphaSliderEl, api.getChannelSliderProps({ channel: 'alpha' }))

    if (this.alphaGridEl)
      spreadProps(this.alphaGridEl, api.getTransparencyGridProps({ size: '12px' }))

    if (this.alphaTrackEl)
      spreadProps(this.alphaTrackEl, api.getChannelSliderTrackProps({ channel: 'alpha' }))

    if (this.alphaThumbEl)
      spreadProps(this.alphaThumbEl, api.getChannelSliderThumbProps({ channel: 'alpha' }))

    const format = api.format
    this.formatGroups.forEach((group) => {
      if (!group.container)
        return
      group.container.style.display = format.startsWith(group.type) ? 'flex' : 'none'
      group.inputs.forEach(({ channel, element }) => {
        if (!element)
          return
        spreadProps(element, api.getChannelInputProps({ channel }))
      })
    })

    if (this.displayGridEl)
      spreadProps(this.displayGridEl, api.getTransparencyGridProps({ size: '4px' }))

    if (this.displaySwatchEl)
      spreadProps(this.displaySwatchEl, api.getSwatchProps({ value: api.value }))

    if (this.contentHexInput)
      spreadProps(this.contentHexInput, api.getChannelInputProps({ channel: 'hex' }))

    if (this.swatchGroupEl)
      spreadProps(this.swatchGroupEl, api.getSwatchGroupProps())

    this.swatchButtons.forEach(({ value, button, gridEl, swatchEl }) => {
      spreadProps(button, api.getSwatchTriggerProps({ value }))
      if (gridEl)
        spreadProps(gridEl, api.getTransparencyGridProps({ size: '4px' }))
      if (swatchEl)
        spreadProps(swatchEl, api.getSwatchProps({ value }))
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(colorPickerControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  const presetsMarkup = presets
    .map(value => `
      <button type="button" data-color-picker-swatch-trigger data-value="${value}">
        <div style="position: relative;">
          <div data-color-picker-swatch-grid></div>
          <div data-color-picker-swatch></div>
        </div>
      </button>
    `)
    .join('')

  layout.main.innerHTML = `
    <div data-testid="outside">out side</div>
    <form data-color-picker-form>
      <input data-color-picker-hidden type="hidden" />
      <div data-color-picker-root>
        <label data-color-picker-label>
          Select Color:
          <span data-testid="value-text" data-color-picker-value-text></span>
        </label>

        <div data-color-picker-control>
          <button type="button" data-testid="colorpicker:trigger" data-color-picker-trigger>
            <div data-color-picker-trigger-grid></div>
            <div data-color-picker-trigger-swatch></div>
          </button>
          <input data-color-picker-input="hex" />
          <input data-color-picker-input="alpha" />
        </div>

        <div data-color-picker-positioner>
          <div data-color-picker-content>
            <div class="content__inner">
              <div data-color-picker-area>
                <div data-color-picker-area-background></div>
                <div data-color-picker-area-thumb></div>
              </div>

              <div data-color-picker-slider="hue">
                <div data-color-picker-slider-track="hue"></div>
                <div data-color-picker-slider-thumb="hue"></div>
              </div>

              <div data-color-picker-slider="alpha">
                <div data-color-picker-slider-grid="alpha"></div>
                <div data-color-picker-slider-track="alpha"></div>
                <div data-color-picker-slider-thumb="alpha"></div>
              </div>

              <div data-color-picker-group="hsl" style="display: none; width: 100%; gap: 4px;">
                <span>H</span>
                <input />
                <span>S</span>
                <input />
                <span>L</span>
                <input />
                <span>A</span>
                <input />
              </div>

              <div data-color-picker-group="rgb" style="display: none; width: 100%; gap: 4px;">
                <span>R</span>
                <input />
                <span>G</span>
                <input />
                <span>B</span>
                <input />
                <span>A</span>
                <input />
              </div>

              <div data-color-picker-group="hsb" style="display: none; width: 100%; gap: 4px;">
                <span>H</span>
                <input />
                <span>S</span>
                <input />
                <span>B</span>
                <input />
                <span>A</span>
                <input />
              </div>

              <div data-color-picker-display style="display: flex; gap: 10px; align-items: center;">
                <div style="position: relative;">
                  <div data-color-picker-display-grid></div>
                  <div data-color-picker-display-swatch></div>
                </div>
                <p data-color-picker-value-text></p>
              </div>

              <input data-color-picker-content-hex />

              <div data-color-picker-swatch-group style="display: flex; gap: 10px;">
                ${presetsMarkup}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  `

  const formEl = layout.main.querySelector<HTMLFormElement>('[data-color-picker-form]')
  if (!formEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new ColorPickerExample(formEl, {
    id: 'color-picker:vanilla',
    name: 'color',
    format: 'hsla',
    value: colorPicker.parse('hsl(0, 100%, 50%)'),
  }, {
    context: {
      get: () => controls.context as Partial<ColorPickerMachineContext>,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })

  instance.init()

  const updateVisualizer = (state?: ColorPickerState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as ColorPickerState)
  instance.onStateChange(updateVisualizer)
}
