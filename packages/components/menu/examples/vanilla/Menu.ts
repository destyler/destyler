import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as MenuState } from '../../src/types'
import { menuControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as menu from '../../index'
import '../style.css'

type MenuMachineContext = ContextFrom<typeof menu.machine>

const items = [
  { value: 'edit', label: 'Edit' },
  { value: 'duplicate', label: 'Duplicate' },
  { value: 'delete', label: 'Delete' },
  { value: 'export', label: 'Export...' },
] as const

type MenuItem = typeof items[number]

class MenuExample extends Component<
  menu.Context,
  menu.Api,
  MenuMachineContext,
  MachineState
> {
  private readonly triggerEl: HTMLButtonElement | null
  private readonly indicatorEl: HTMLElement | null
  private readonly positionerEl: HTMLDivElement
  private readonly contentEl: HTMLUListElement
  private readonly itemElements: Record<MenuItem['value'], HTMLLIElement>
  private readonly stateListeners = new Set<(state: MenuState) => void>()
  private isMounted = false

  constructor(rootEl: HTMLElement, context: menu.Context, options?: any) {
    super(rootEl, context, options)
    this.triggerEl = rootEl.querySelector('[data-menu-trigger]')
    this.indicatorEl = rootEl.querySelector('[data-menu-indicator]')

    this.positionerEl = document.createElement('div')
    this.contentEl = document.createElement('ul')
    this.positionerEl.appendChild(this.contentEl)

    this.itemElements = {} as Record<MenuItem['value'], HTMLLIElement>
    items.forEach((item) => {
      const element = document.createElement('li')
      element.textContent = item.label
      this.itemElements[item.value] = element
      this.contentEl.appendChild(element)
    })
  }

  initService(context: menu.Context) {
    return menu.machine(context) as menu.Service
  }

  initApi() {
    return menu.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: MenuState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: MenuState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private attachMenu() {
    if (this.isMounted)
      return
    document.body.appendChild(this.positionerEl)
    this.isMounted = true
  }

  private detachMenu() {
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
        'data-testid': 'menu:trigger',
      })
    }

    if (this.indicatorEl)
      spreadProps(this.indicatorEl, api.getIndicatorProps())

    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, {
      ...api.getContentProps(),
      'data-testid': 'menu:content',
    })

    items.forEach((item) => {
      const element = this.itemElements[item.value]
      spreadProps(element, api.getItemProps({ value: item.value }))
    })

    if (api.open)
      this.attachMenu()
    else
      this.detachMenu()
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(menuControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-testid="outside">outside</div>
    <main data-menu-example>
      <button type="button" data-menu-trigger>
        Actions <span data-menu-indicator>▾</span>
      </button>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-menu-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new MenuExample(scope, {
    id: 'menu:vanilla',
  }, {
    context: {
      get: () => controls.context as Partial<MenuMachineContext>,
      subscribe: (fn: (ctx: Partial<MenuMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: MenuState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as MenuState)
  instance.onStateChange(updateVisualizer)
}
