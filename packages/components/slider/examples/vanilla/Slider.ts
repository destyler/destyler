import type { ContextFrom } from '@destyler/vanilla'
import type { State as SliderState } from '../../src/types'
import { sliderControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as slider from '../../index'
import '../style.css'

type SliderMachineContext = ContextFrom<typeof slider.machine>
type SliderService = ReturnType<typeof slider.machine>
type SliderSnapshot = Parameters<typeof slider.connect>[0]

interface MarkerRef {
  value: number
  element: HTMLElement
}

class SliderExample extends Component<slider.Context, slider.Api, SliderMachineContext> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-slider-root]')
  private readonly labelEl = this.rootEl.querySelector<HTMLLabelElement>('[data-slider-label]')
  private readonly valueTextEl = this.rootEl.querySelector<HTMLOutputElement>('[data-slider-value-text]')
  private readonly controlEl = this.rootEl.querySelector<HTMLElement>('[data-slider-control]')
  private readonly trackEl = this.rootEl.querySelector<HTMLElement>('[data-slider-track]')
  private readonly rangeEl = this.rootEl.querySelector<HTMLElement>('[data-slider-range]')
  private readonly markerGroupEl = this.rootEl.querySelector<HTMLElement>('[data-slider-marker-group]')
  private readonly markers: MarkerRef[] = Array.from(
    this.rootEl.querySelectorAll<HTMLElement>('[data-slider-marker]'),
  ).map(element => ({
    value: Number(element.dataset.value ?? '0'),
    element,
  }))

  private readonly thumbsHost = this.rootEl.querySelector<HTMLElement>('[data-slider-thumbs]')
  private thumbItems: Array<{ wrapper: HTMLElement, input: HTMLInputElement }> = []
  private readonly stateListeners = new Set<(state: SliderState) => void>()
  // Mirror the machine's thumb-size tracking so parts become visible once rendered.
  private thumbObserver: ResizeObserver | null = typeof window !== 'undefined' && 'ResizeObserver' in window
    ? new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry)
          return
        const { width, height } = entry.contentRect
        this.applyThumbSize(width, height)
      })
    : null

  private lastThumbSize: { width: number, height: number } | null = null

  initService(context: slider.Context) {
    return slider.machine(context) as SliderService
  }

  initApi() {
    return slider.connect(this.service.state as SliderSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: SliderState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: SliderState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private syncThumbs(api: slider.Api) {
    if (!this.thumbsHost)
      return

    const desiredCount = api.value.length

    while (this.thumbItems.length < desiredCount) {
      const wrapper = document.createElement('div')
      const input = document.createElement('input')
      input.type = 'hidden'
      wrapper.appendChild(input)
      this.thumbsHost.appendChild(wrapper)
      this.thumbItems.push({ wrapper, input })
    }

    while (this.thumbItems.length > desiredCount) {
      const item = this.thumbItems.pop()
      item?.wrapper.remove()
    }

    this.thumbItems.forEach(({ wrapper, input }, index) => {
      spreadProps(wrapper, api.getThumbProps({ index }))
      spreadProps(input, api.getHiddenInputProps({ index }))
    })

    this.observeThumbs()
  }

  private observeThumbs() {
    if (!this.thumbObserver)
      return
    this.thumbObserver.disconnect()
    this.thumbItems.forEach(({ wrapper }) => {
      this.thumbObserver!.observe(wrapper)
    })
    const firstThumb = this.thumbItems[0]?.wrapper
    if (firstThumb) {
      const rect = firstThumb.getBoundingClientRect()
      if (rect.width && rect.height)
        this.applyThumbSize(rect.width, rect.height)
    }
  }

  private applyThumbSize(width: number, height: number) {
    if (!this.service)
      return
    if (this.lastThumbSize && this.lastThumbSize.width === width && this.lastThumbSize.height === height)
      return
    this.lastThumbSize = { width, height }
    this.service.setContext({ thumbSize: this.lastThumbSize } as Partial<slider.Context>)
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.labelEl) {
      spreadProps(this.labelEl, {
        ...api.getLabelProps(),
        'data-testid': 'slider:label',
      })
    }

    if (this.valueTextEl) {
      spreadProps(this.valueTextEl, api.getValueTextProps())
      this.valueTextEl.textContent = api.value.join(', ')
    }

    if (this.controlEl)
      spreadProps(this.controlEl, api.getControlProps())

    if (this.trackEl)
      spreadProps(this.trackEl, api.getTrackProps())

    if (this.rangeEl)
      spreadProps(this.rangeEl, api.getRangeProps())

    if (this.markerGroupEl)
      spreadProps(this.markerGroupEl, api.getMarkerGroupProps())

    this.markers.forEach(({ value, element }) => {
      if (!Number.isNaN(value))
        spreadProps(element, api.getMarkerProps({ value }))
    })

    this.syncThumbs(api)
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(sliderControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="slider">
      <div data-slider-example>
        <form>
          <div data-slider-root>
            <div>
              <label data-slider-label data-testid="label">Slider Label</label>
              <output data-slider-value-text data-testid="output"></output>
            </div>
            <div class="control-area">
              <div data-testid="slider:control" data-slider-control>
                <div data-slider-track data-testid="track">
                  <div data-slider-range></div>
                </div>
                <div style="width:auto;height:100%;" data-slider-thumbs></div>
              </div>
              <div data-slider-marker-group>
                <span data-slider-marker data-value="10">*</span>
                <span data-slider-marker data-value="30">*</span>
                <span data-slider-marker data-value="90">*</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-slider-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new SliderExample(scope, { id: 'slider:vanilla', name: 'quantity', value: [0] }, {
    context: {
      get: () => controls.context as Partial<SliderMachineContext>,
      subscribe: (fn: (ctx: Partial<SliderMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: SliderState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as SliderState)
  instance.onStateChange(updateVisualizer)
}
