import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { sliderControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as slider from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type SliderMachineContext = ContextFrom<typeof slider.machine>

@customElement('destyler-slider')
export class SliderElement extends LitElement {
  private controls = new ControlsController(sliderControls)
  // Measure the first thumb so the machine knows its size and can reveal the parts.
  private thumbObserver: ResizeObserver | null = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver((entries) => {
        const entry = entries[0]
        if (!entry)
          return
        const { width, height } = entry.contentRect
        this.updateThumbSize(width, height)
      })
    : null

  private observedThumb: Element | null = null
  private lastThumbSize: { width: number, height: number } | null = null

  private machine = new MachineController(
    this,
    slider.machine({
      id: 'slider:lit',
      name: 'quantity',
      value: [0],
    }),
    {
      context: {
        get: () => this.controls.context as Partial<SliderMachineContext>,
        subscribe: (fn: (ctx: Partial<SliderMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  disconnectedCallback(): void {
    this.thumbObserver?.disconnect()
    this.observedThumb = null
    super.disconnectedCallback()
  }

  protected firstUpdated(): void {
    this.ensureThumbObserver()
  }

  protected updated(): void {
    this.ensureThumbObserver()
  }

  private ensureThumbObserver() {
    if (!this.thumbObserver)
      return
    const thumb = this.renderRoot.querySelector<HTMLElement>('[data-scope="slider"][data-part="thumb"]')
    if (!thumb || thumb === this.observedThumb)
      return
    if (this.observedThumb)
      this.thumbObserver.unobserve(this.observedThumb)
    this.observedThumb = thumb
    this.thumbObserver.observe(thumb)
    this.measureThumbImmediate(thumb)
  }

  private measureThumbImmediate(element: HTMLElement) {
    const rect = element.getBoundingClientRect()
    if (!rect.width || !rect.height)
      return
    this.updateThumbSize(rect.width, rect.height)
  }

  private updateThumbSize(width: number, height: number) {
    if (!this.machine?.service)
      return
    const nextSize = { width, height }
    if (this.lastThumbSize && this.lastThumbSize.width === width && this.lastThumbSize.height === height)
      return
    this.lastThumbSize = nextSize
    this.machine.service.setContext({ thumbSize: nextSize } as Partial<SliderMachineContext>)
  }

  render() {
    const api = slider.connect(this.machine.state, this.machine.send, normalizeProps)
    const values = api.value

    return html`
      <destyler-layout>
        <main class="slider">
          <form>
            <div ${spread(api.getRootProps())}>
              <div>
                <label data-testid="label" ${spread(api.getLabelProps())}>
                  Slider Label
                </label>
                <output data-testid="output" ${spread(api.getValueTextProps())}>
                  ${values.join(', ')}
                </output>
              </div>
              <div class="control-area">
                <div ${spread(api.getControlProps())}>
                  <div data-testid="track" ${spread(api.getTrackProps())}>
                    <div ${spread(api.getRangeProps())}></div>
                  </div>
                  ${values.length > 0
                    ? html`<span ${spread(api.getDraggingIndicatorProps({ index: 0 }))}>${api.getThumbValue(0)}</span>`
                    : null}
                  ${values.map((_, index) => html`
                    <div ${spread(api.getThumbProps({ index }))}>
                      <input ${spread(api.getHiddenInputProps({ index }))} />
                    </div>
                  `)}
                </div>
                <div ${spread(api.getMarkerGroupProps())}>
                  <span ${spread(api.getMarkerProps({ value: 10 }))}>*</span>
                  <span ${spread(api.getMarkerProps({ value: 30 }))}>*</span>
                  <span ${spread(api.getMarkerProps({ value: 90 }))}>*</span>
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
    'destyler-slider': SliderElement
  }
}
