import type { ContextFrom } from '@destyler/vanilla'
import type { State as CollapsibleState } from '../../index'
import { collapsibleControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as collapsible from '../../index'
import '../style.css'

type CollapsibleMachineContext = ContextFrom<typeof collapsible.machine>

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

class CollapsibleExample extends Component<
  collapsible.Context,
  collapsible.Api,
  CollapsibleMachineContext,
  collapsible.MachineState
> {
  private readonly triggerEl: HTMLButtonElement | null
  private readonly contentEl: HTMLElement | null
  private readonly exitStatusEl: HTMLElement | null
  private readonly openStatusEl: HTMLElement | null
  private readonly stateListeners = new Set<(state: CollapsibleState) => void>()
  private controlledOpen = false
  private exitCount = 0

  constructor(rootEl: HTMLElement, context: collapsible.Context, options?: any) {
    super(rootEl, context, options)
    this.triggerEl = rootEl.querySelector<HTMLButtonElement>('[data-collapsible-trigger]')
    this.contentEl = rootEl.querySelector<HTMLElement>('[data-collapsible-content]')
    this.exitStatusEl = rootEl.ownerDocument.querySelector<HTMLElement>('[data-exit-status]')
    this.openStatusEl = rootEl.ownerDocument.querySelector<HTMLElement>('[data-open-status]')
  }

  initService(context: collapsible.Context) {
    return collapsible.machine(context) as collapsible.Service
  }

  initApi() {
    return collapsible.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: CollapsibleState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: CollapsibleState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private writeExitStatus() {
    if (!this.exitStatusEl)
      return
    this.exitStatusEl.dataset.exitCount = String(this.exitCount)
    this.exitStatusEl.textContent = `exitCount=${this.exitCount}`
  }

  private writeOpenStatus(open: boolean | null) {
    if (!this.openStatusEl)
      return
    this.openStatusEl.dataset.openRequested = open == null ? '' : String(open)
    this.openStatusEl.textContent = `openRequested=${this.openStatusEl.dataset.openRequested}`
  }

  onExitComplete = () => {
    this.exitCount += 1
    this.writeExitStatus()
  }

  onOpenChange = (details: { open: boolean }) => {
    this.writeOpenStatus(details.open)
  }

  getControlledOpen() {
    return this.controlledOpen
  }

  setControlledOpen(next: boolean) {
    this.controlledOpen = next
  }

  render = () => {
    const rootProps = this.api.getRootProps()
    spreadProps(this.rootEl, {
      ...rootProps,
      class: classNames('collapsible-root', rootProps.class),
    })

    if (this.triggerEl) {
      const triggerProps = this.api.getTriggerProps()
      spreadProps(this.triggerEl, {
        ...triggerProps,
        class: classNames('collapsible-trigger', triggerProps.class),
      })
    }

    if (this.contentEl) {
      const contentProps = this.api.getContentProps()
      spreadProps(this.contentEl, {
        ...contentProps,
        class: classNames('collapsible-content', contentProps.class),
      })
    }
  }

  setOpen(nextOpen: boolean) {
    this.api.setOpen(nextOpen)
  }

  syncContext(context: Partial<CollapsibleMachineContext>) {
    this.applyContext(context)
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(collapsibleControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div class="collapsible-root" data-collapsible-root>
      <button class="collapsible-trigger" data-testid="collapsible:trigger" data-collapsible-trigger>
        Collapsible Trigger
      </button>
      <div class="collapsible-content" data-testid="collapsible:content" data-collapsible-content>
        <p>
          Lorem dfd dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna sfsd. Ut enim ad minimdfd v eniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
          id est laborum.
        </p>
      </div>
    </div>
    <div>
      <div>Toggle Controls</div>
      <button class="button" data-collapsible-open>
        Open
      </button>
      <button class="button" data-collapsible-close>
        Close
      </button>
      <div data-testid="exit-status" data-exit-status data-exit-count="0">exitCount=0</div>
      <div data-testid="open-status" data-open-status data-open-requested="">openRequested=</div>
    </div>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-collapsible-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  let instance: CollapsibleExample

  const mapControlsContext = (): Partial<CollapsibleMachineContext> => {
    const { openControlled = false, ...rest } = controls.context as Partial<CollapsibleMachineContext> & {
      openControlled?: boolean
    }
    return {
      ...rest,
      'open.controlled': Boolean(openControlled),
      ...(openControlled ? { open: instance.getControlledOpen() } : {}),
      'onExitComplete': () => instance.onExitComplete(),
      'onOpenChange': details => instance.onOpenChange(details),
    }
  }

  instance = new CollapsibleExample(rootEl, {
    id: 'collapsible:vanilla',
    onExitComplete: () => {},
    onOpenChange: () => {},
  }, {
    context: {
      get: () => mapControlsContext(),
      subscribe: (fn: any) => controls.subscribe(() => fn(mapControlsContext())),
    },
  })

  // Replace stub callbacks now that instance exists
  instance.init()
  instance.syncContext(mapControlsContext())

  const openButton = layout.main.querySelector<HTMLButtonElement>('[data-collapsible-open]')
  const closeButton = layout.main.querySelector<HTMLButtonElement>('[data-collapsible-close]')

  openButton?.addEventListener('click', () => {
    const { openControlled = false } = controls.context as { openControlled?: boolean }
    if (openControlled) {
      instance.setControlledOpen(true)
      instance.syncContext(mapControlsContext())
    }
    else {
      instance.setOpen(true)
    }
  })
  closeButton?.addEventListener('click', () => {
    const { openControlled = false } = controls.context as { openControlled?: boolean }
    if (openControlled) {
      instance.setControlledOpen(false)
      instance.syncContext(mapControlsContext())
    }
    else {
      instance.setOpen(false)
    }
  })

  const updateVisualizer = (state?: CollapsibleState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as CollapsibleState)
  instance.onStateChange(updateVisualizer)
}
