import type { ContextFrom } from '@destyler/vanilla'
import type { State as HoverCardState, MachineState } from '../../src/types'
import { hoverCardControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as hoverCard from '../../index'
import '../style.css'

type HoverCardMachineContext = ContextFrom<typeof hoverCard.machine>

class HoverCardExample extends Component<
  hoverCard.Context,
  hoverCard.Api,
  HoverCardMachineContext,
  MachineState
> {
  private readonly triggerEl: HTMLAnchorElement | null
  private readonly positionerEl: HTMLDivElement
  private readonly contentEl: HTMLDivElement
  private readonly arrowEl: HTMLDivElement
  private readonly arrowTipEl: HTMLDivElement
  private readonly previewTextEl: HTMLParagraphElement
  private readonly previewLinkEl: HTMLAnchorElement
  private readonly stateListeners = new Set<(state: HoverCardState) => void>()
  private isMounted = false

  constructor(rootEl: HTMLElement, context: hoverCard.Context, options?: any) {
    super(rootEl, context, options)

    this.triggerEl = rootEl.querySelector('[data-hover-card-trigger]')

    this.positionerEl = document.createElement('div')
    this.contentEl = document.createElement('div')
    this.arrowEl = document.createElement('div')
    this.arrowTipEl = document.createElement('div')
    this.previewTextEl = document.createElement('p')
    this.previewLinkEl = document.createElement('a')

    this.previewTextEl.textContent = 'Twitter Preview'
    this.previewLinkEl.href = 'https://twitter.com/elonehoo'
    this.previewLinkEl.target = '_blank'
    this.previewLinkEl.rel = 'noreferrer'
    this.previewLinkEl.textContent = 'Twitter'

    this.arrowEl.appendChild(this.arrowTipEl)
    this.contentEl.append(this.arrowEl, this.previewTextEl, this.previewLinkEl)
    this.positionerEl.appendChild(this.contentEl)
  }

  initService(context: hoverCard.Context) {
    return hoverCard.machine(context) as hoverCard.Service
  }

  initApi() {
    return hoverCard.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: HoverCardState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: HoverCardState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private attachHoverCard() {
    if (this.isMounted)
      return
    document.body.appendChild(this.positionerEl)
    this.isMounted = true
  }

  private detachHoverCard() {
    if (!this.isMounted)
      return
    this.positionerEl.remove()
    this.isMounted = false
  }

  render = () => {
    const api = this.api

    if (this.triggerEl)
      spreadProps(this.triggerEl, api.getTriggerProps())

    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, api.getContentProps())
    spreadProps(this.arrowEl, api.getArrowProps())
    spreadProps(this.arrowTipEl, api.getArrowTipProps())

    if (api.open)
      this.attachHoverCard()
    else
      this.detachHoverCard()
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(hoverCardControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main data-hover-card-example>
      <div style="display: flex; gap: 50px;">
        <a href="https://twitter.com/elonehoo" target="_blank" rel="noreferrer" data-hover-card-trigger>
          Twitter
        </a>
        <div data-part="test-text">Test text</div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-hover-card-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new HoverCardExample(scope, { id: 'hover-card:vanilla' }, {
    context: {
      get: () => controls.context as Partial<HoverCardMachineContext>,
      subscribe: (fn: (ctx: Partial<HoverCardMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: HoverCardState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as HoverCardState)
  instance.onStateChange(updateVisualizer)
}
