import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as TooltipState } from '../../src/types'
import { Layout, StateVisualizer, Toolbar } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tooltip from '../../index'
import '../style.css'

type TooltipMachineContext = ContextFrom<typeof tooltip.machine>
type TooltipSnapshot = Parameters<typeof tooltip.connect>[0]

type TooltipListener = (state: TooltipState) => void

class TooltipInlineExample extends Component<
  tooltip.Context,
  tooltip.Api,
  TooltipMachineContext,
  MachineState
> {
  private readonly triggerEl = this.rootEl.querySelector<HTMLButtonElement>('[data-tooltip-trigger]')
  private readonly positionerEl = this.rootEl.querySelector<HTMLElement>('[data-tooltip-positioner]')
  private readonly contentEl = this.rootEl.querySelector<HTMLElement>('[data-tooltip-content]')
  private readonly stateListeners = new Set<TooltipListener>()

  initService(context: tooltip.Context) {
    return tooltip.machine(context) as tooltip.Service
  }

  initApi() {
    return tooltip.connect(this.service.state as TooltipSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: TooltipListener) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: TooltipState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.triggerEl) {
      spreadProps(this.triggerEl, {
        ...api.getTriggerProps(),
        'data-testid': 'tip-1-trigger',
      })
    }

    if (this.positionerEl) {
      spreadProps(this.positionerEl, api.getPositionerProps())
      this.positionerEl.toggleAttribute('hidden', !api.open)
    }

    if (this.contentEl) {
      spreadProps(this.contentEl, {
        ...api.getContentProps(),
        'data-testid': 'tip-1-tooltip',
      })
    }
  }
}

class TooltipPortalExample extends Component<
  tooltip.Context,
  tooltip.Api,
  TooltipMachineContext,
  MachineState
> {
  private readonly triggerEl = this.rootEl.querySelector<HTMLButtonElement>('[data-tooltip-trigger]')
  private readonly positionerEl = document.createElement('div')
  private readonly contentEl = document.createElement('div')
  private readonly stateListeners = new Set<TooltipListener>()
  private isMounted = false

  constructor(rootEl: HTMLElement, context: tooltip.Context, options?: any) {
    super(rootEl, context, options)
    this.contentEl.className = 'tooltip-content'
    this.contentEl.textContent = 'Tooltip 2'
    this.positionerEl.appendChild(this.contentEl)
  }

  initService(context: tooltip.Context) {
    return tooltip.machine(context) as tooltip.Service
  }

  initApi() {
    return tooltip.connect(this.service.state as TooltipSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: TooltipListener) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: TooltipState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private attach() {
    if (this.isMounted)
      return
    document.body.appendChild(this.positionerEl)
    this.isMounted = true
  }

  private detach() {
    if (!this.isMounted)
      return
    this.positionerEl.remove()
    this.isMounted = false
  }

  render = () => {
    const api = this.api

    if (this.triggerEl) {
      spreadProps(this.triggerEl, {
        ...api.getTriggerProps(),
        'data-testid': 'tip-2-trigger',
      })
    }

    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, {
      ...api.getContentProps(),
      'data-testid': 'tip-2-tooltip',
    })

    if (api.open)
      this.attach()
    else
      this.detach()
  }
}

function mountVisualizer(toolbar: ReturnType<typeof Toolbar>, states: { first?: TooltipState, second?: TooltipState }) {
  toolbar.setVisualizerSlot(() => {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.gap = '12px'

    if (states.first)
      container.appendChild(StateVisualizer({ state: states.first, label: 'Tooltip 1' }))

    if (states.second)
      container.appendChild(StateVisualizer({ state: states.second, label: 'Tooltip 2' }))

    return container
  })
}

export function render(target: HTMLElement) {
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="tooltip">
      <div class="root" data-tooltip-examples>
        <div data-tooltip-inline>
          <button type="button" data-tooltip-trigger>Hover me</button>
          <div data-tooltip-positioner>
            <div class="tooltip-content" data-tooltip-content>Tooltip</div>
          </div>
        </div>
        <div data-tooltip-portal>
          <button type="button" data-tooltip-trigger>Over me</button>
        </div>
      </div>
    </main>
  `

  const inlineScope = layout.main.querySelector<HTMLElement>('[data-tooltip-inline]')
  const portalScope = layout.main.querySelector<HTMLElement>('[data-tooltip-portal]')

  if (!inlineScope || !portalScope)
    return

  const toolbar = Toolbar({ active: 'visualizer' })
  layout.root.appendChild(toolbar.root)

  const inlineInstance = new TooltipInlineExample(inlineScope, { id: 'tooltip:vanilla:1' })
  const portalInstance = new TooltipPortalExample(portalScope, { id: 'tooltip:vanilla:2' })

  inlineInstance.init()
  portalInstance.init()

  const states: { first?: TooltipState, second?: TooltipState } = {
    first: inlineInstance.state as TooltipState,
    second: portalInstance.state as TooltipState,
  }

  mountVisualizer(toolbar, states)

  inlineInstance.onStateChange((state) => {
    states.first = state
    mountVisualizer(toolbar, states)
  })

  portalInstance.onStateChange((state) => {
    states.second = state
    mountVisualizer(toolbar, states)
  })
}
