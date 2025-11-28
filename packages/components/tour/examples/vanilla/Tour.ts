import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as TourState } from '../../src/types'
import { tourControls, tourData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tour from '../../index'
import '../style.css'

type TourMachineContext = ContextFrom<typeof tour.machine>

class TourExample extends Component<tour.Context, tour.Api, TourMachineContext, MachineState> {
  private readonly startButton = this.rootEl.querySelector<HTMLButtonElement>('[data-tour-start]')
  private readonly backdropEl = document.createElement('div')
  private readonly spotlightEl = document.createElement('div')
  private readonly positionerEl = document.createElement('div')
  private readonly contentEl = document.createElement('div')
  private readonly arrowEl = document.createElement('div')
  private readonly arrowTipEl = document.createElement('div')
  private readonly titleEl = document.createElement('p')
  private readonly descriptionEl = document.createElement('div')
  private readonly progressEl = document.createElement('div')
  private readonly actionsWrapper = document.createElement('div')
  private readonly closeButton = document.createElement('button')
  private readonly stateListeners = new Set<(state: TourState) => void>()
  private overlayMounted = false

  constructor(rootEl: HTMLElement, context: tour.Context, options?: any) {
    super(rootEl, context, options)

    this.arrowEl.appendChild(this.arrowTipEl)
    this.contentEl.append(this.arrowEl, this.titleEl, this.descriptionEl, this.progressEl, this.actionsWrapper, this.closeButton)
    this.positionerEl.appendChild(this.contentEl)

    this.actionsWrapper.className = 'tour button__group'
    this.closeButton.type = 'button'
    this.closeButton.textContent = '×'
  }

  initService(context: tour.Context) {
    return tour.machine(context) as tour.Service
  }

  initApi() {
    return tour.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: TourState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: TourState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private attachOverlay() {
    if (this.overlayMounted)
      return
    document.body.appendChild(this.backdropEl)
    document.body.appendChild(this.spotlightEl)
    document.body.appendChild(this.positionerEl)
    this.overlayMounted = true
  }

  private detachOverlay() {
    if (!this.overlayMounted)
      return
    this.backdropEl.remove()
    this.spotlightEl.remove()
    this.positionerEl.remove()
    this.overlayMounted = false
  }

  override destroy(): void {
    this.detachOverlay()
    super.destroy()
  }

  private renderActions(api: tour.Api) {
    const actions = api.step?.actions ?? []
    this.actionsWrapper.innerHTML = ''

    if (actions.length === 0) {
      this.actionsWrapper.hidden = true
      return
    }

    this.actionsWrapper.hidden = false
    actions.forEach((action) => {
      const button = document.createElement('button')
      button.textContent = action.label
      spreadProps(button, api.getActionTriggerProps({ action }))
      this.actionsWrapper.appendChild(button)
    })
  }

  render = () => {
    this.attachOverlay()
    const api = this.api

    if (this.startButton && !this.startButton.dataset.bound) {
      this.startButton.dataset.bound = 'true'
      this.startButton.addEventListener('click', () => api.start())
    }

    spreadProps(this.backdropEl, api.getBackdropProps())
    spreadProps(this.spotlightEl, api.getSpotlightProps())
    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, api.getContentProps())
    spreadProps(this.arrowEl, api.getArrowProps())
    spreadProps(this.arrowTipEl, api.getArrowTipProps())
    spreadProps(this.titleEl, api.getTitleProps())
    spreadProps(this.descriptionEl, api.getDescriptionProps())
    spreadProps(this.progressEl, api.getProgressTextProps())
    spreadProps(this.closeButton, api.getCloseTriggerProps())

    this.titleEl.textContent = api.step?.title ?? ''
    this.descriptionEl.textContent = api.step?.description ?? ''
    this.progressEl.textContent = api.getProgressText()

    this.arrowEl.hidden = !api.step?.arrow
    this.backdropEl.hidden = !api.step?.backdrop

    this.renderActions(api)
  }
}

export function render(target: HTMLElement): () => void {
  const controls = useControls(tourControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  const iframeContent = `<!doctype html><body><div class="tour__frame-inner"><h1 id="step-2a">Iframe Content</h1><p>Even vanilla tours can highlight DOM in other documents.</p><p>Scroll around to see the overlay follow along.</p></div></body>`

  layout.main.innerHTML = `
    <div data-testid="outside">outside</div>
    <main class="tour" data-tour-root>
      <section>
        <button type="button" class="tour__start" data-tour-start>Start Tour</button>
        <div class="steps__container">
          <h3 id="step-1">Step 1 · Welcome</h3>
          <div class="overflow__container">
            <div class="h-200px"></div>
            <h3 id="step-2">Step 2 · Scroll-aware</h3>
            <div class="h-100px"></div>
          </div>
          <iframe class="tour__frame" title="tour-frame" srcdoc='${iframeContent.replace(/'/g, '&apos;')}'></iframe>
          <h3 id="step-3">Step 3 · Normal flow</h3>
          <h3 id="step-4">Step 4 · Near the bottom</h3>
        </div>
      </section>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-tour-root]')
  if (!scope)
    return () => {}

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new TourExample(scope, { id: 'tour:vanilla', steps: tourData }, {
    context: {
      get: () => controls.context as Partial<TourMachineContext>,
      subscribe: (fn: (ctx: Partial<TourMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: TourState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['steps'] }))
  }

  updateVisualizer(instance.state as TourState)
  instance.onStateChange(updateVisualizer)

  return () => {
    instance.destroy()
    toolbar.setControlsSlot(undefined)
    toolbar.setVisualizerSlot(undefined)
    layout.root.remove()
  }
}
