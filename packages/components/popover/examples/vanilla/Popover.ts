import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as PopoverState } from '../../src/types'
import { popoverControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as popover from '../../index'
import '../style.css'

type PopoverMachineContext = ContextFrom<typeof popover.machine>

type PopoverService = ReturnType<typeof popover.machine>

type PopoverSnapshot = Parameters<typeof popover.connect>[0]

class PopoverExample extends Component<
  popover.Context,
  popover.Api,
  PopoverMachineContext,
  MachineState
> {
  private readonly triggerEl: HTMLButtonElement | null
  private readonly indicatorEl: HTMLElement | null
  private readonly anchorEl: HTMLElement | null
  private readonly inlineSlot: HTMLElement | null
  private readonly positionerEl: HTMLDivElement
  private readonly contentEl: HTMLDivElement
  private readonly arrowEl: HTMLDivElement
  private readonly arrowTipEl: HTMLDivElement
  private readonly titleEl: HTMLDivElement
  private readonly bodyEl: HTMLDivElement
  private readonly nonFocusableLink: HTMLAnchorElement
  private readonly focusableLink: HTMLAnchorElement
  private readonly inputEl: HTMLInputElement
  private readonly closeButton: HTMLButtonElement
  private readonly stateListeners = new Set<(state: PopoverState) => void>()
  private mountedParent: HTMLElement | null = null

  constructor(rootEl: HTMLElement, context: popover.Context, options?: any) {
    super(rootEl, context, options)

    this.triggerEl = rootEl.querySelector('[data-popover-trigger]')
    this.indicatorEl = rootEl.querySelector('[data-popover-indicator]')
    this.anchorEl = rootEl.querySelector('[data-popover-anchor]')
    this.inlineSlot = rootEl.querySelector('[data-popover-inline-slot]')

    this.positionerEl = document.createElement('div')
    this.contentEl = document.createElement('div')
    this.contentEl.classList.add('popover-content')
    this.contentEl.dataset.testid = 'popover:content'

    this.arrowEl = document.createElement('div')
    this.arrowTipEl = document.createElement('div')
    this.arrowEl.appendChild(this.arrowTipEl)

    this.titleEl = document.createElement('div')
    this.titleEl.dataset.testid = 'popover-title'

    this.bodyEl = document.createElement('div')
    this.bodyEl.dataset.part = 'body'
    this.bodyEl.dataset.testid = 'popover-body'

    this.nonFocusableLink = document.createElement('a')
    this.nonFocusableLink.textContent = 'Non-focusable Link'

    this.focusableLink = document.createElement('a')
    this.focusableLink.href = '#'
    this.focusableLink.dataset.testid = 'focusable-link'
    this.focusableLink.textContent = 'Focusable Link'

    this.inputEl = document.createElement('input')
    this.inputEl.placeholder = 'input'
    this.inputEl.dataset.testid = 'input'

    this.closeButton = document.createElement('button')
    this.closeButton.type = 'button'
    this.closeButton.dataset.testid = 'close:trigger'
    this.closeButton.textContent = 'X'

    this.bodyEl.append(this.nonFocusableLink, this.focusableLink, this.inputEl, this.closeButton)
    this.contentEl.append(this.arrowEl, this.titleEl, this.bodyEl)
    this.positionerEl.appendChild(this.contentEl)
  }

  initService(context: popover.Context) {
    return popover.machine(context) as PopoverService
  }

  initApi() {
    return popover.connect(this.service.state as PopoverSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: PopoverState) => void) {
    this.stateListeners.add(listener)
    return () => this.stateListeners.delete(listener)
  }

  protected override onTransition(state: PopoverState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  override destroy(): void {
    this.stateListeners.clear()
    this.positionerEl.remove()
    this.mountedParent = null
    super.destroy()
  }

  private updatePositionerParent(portalled: boolean) {
    const nextParent = portalled ? document.body : this.inlineSlot ?? this.rootEl
    if (!nextParent)
      return

    if (this.mountedParent !== nextParent) {
      this.positionerEl.remove()
      nextParent.appendChild(this.positionerEl)
      this.mountedParent = nextParent
    }
    else if (!this.positionerEl.isConnected) {
      nextParent.appendChild(this.positionerEl)
    }
  }

  render = () => {
    const api = this.api
    this.updatePositionerParent(api.portalled)

    if (this.triggerEl) {
      spreadProps(this.triggerEl, {
        ...api.getTriggerProps(),
        'data-testid': 'popover:trigger',
      })
    }

    if (this.indicatorEl)
      spreadProps(this.indicatorEl, api.getIndicatorProps())

    if (this.anchorEl)
      spreadProps(this.anchorEl, api.getAnchorProps())

    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, api.getContentProps())
    spreadProps(this.arrowEl, api.getArrowProps())
    spreadProps(this.arrowTipEl, api.getArrowTipProps())
    spreadProps(this.titleEl, api.getTitleProps())
    spreadProps(this.closeButton, api.getCloseTriggerProps())
  }
}

export function render(target: HTMLElement): () => void {
  const controls = useControls(popoverControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-testid="outside">out side</div>
    <main class="popover" data-popover-example>
      <div data-part="root" data-popover-root>
        <button type="button" data-testid="popover-trigger" data-popover-trigger>
          Click me
          <div data-popover-indicator>&gt;</div>
        </button>
        <div data-popover-anchor>anchor</div>
        <div data-popover-inline-slot></div>
        <span data-testid="plain-text">I am just text</span>
        <button type="button" data-testid="button-after">Button :after</button>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-popover-root]')
  if (!scope)
    return () => {}

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new PopoverExample(scope, { id: 'popover:vanilla' }, {
    context: {
      get: () => controls.context as Partial<PopoverMachineContext>,
      subscribe: (fn: (ctx: Partial<PopoverMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: PopoverState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as PopoverState)
  const unsubscribeVisualizer = instance.onStateChange(updateVisualizer)

  return () => {
    unsubscribeVisualizer?.()
    instance.destroy()
  }
}
