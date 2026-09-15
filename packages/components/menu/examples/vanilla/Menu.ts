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

const shareItems = [
  { value: 'messages', label: 'Messages' },
  { value: 'airdrop', label: 'Airdrop' },
  { value: 'whatsapp', label: 'WhatsApp' },
] as const

class MenuExample extends Component<
  menu.Context,
  menu.Api,
  MenuMachineContext,
  MachineState
> {
  private readonly triggerEl: HTMLButtonElement | null
  private readonly contextTriggerEl: HTMLElement | null
  private readonly indicatorEl: HTMLElement | null
  private readonly optionStatusEl: HTMLElement | null
  private readonly positionerEl: HTMLDivElement
  private readonly contentEl: HTMLUListElement
  private readonly itemElements: Record<MenuItem['value'], HTMLLIElement>
  private readonly shareTriggerEl: HTMLLIElement
  private readonly boldOptionEl: HTMLLIElement
  private readonly alignLeftEl: HTMLLIElement
  private readonly alignCenterEl: HTMLLIElement
  private readonly stateListeners = new Set<(state: MenuState) => void>()
  private isMounted = false
  private childApiProvider: (() => menu.Api) | null = null
  private boldChecked = false
  private alignValue: 'left' | 'center' = 'left'
  private readonly contentTestId: string
  private readonly includeOptions: boolean

  constructor(
    rootEl: HTMLElement,
    context: menu.Context,
    options?: any,
    opts?: { contentTestId?: string, includeOptions?: boolean },
  ) {
    super(rootEl, context, options)
    this.contentTestId = opts?.contentTestId ?? 'menu:content'
    this.includeOptions = opts?.includeOptions ?? true
    this.triggerEl = rootEl.querySelector('[data-menu-trigger]')
    this.contextTriggerEl = rootEl.querySelector('[data-menu-context-trigger]')
    this.indicatorEl = rootEl.querySelector('[data-menu-indicator]')
    this.optionStatusEl = rootEl.querySelector('[data-option-status]')

    this.positionerEl = document.createElement('div')
    this.contentEl = document.createElement('ul')
    this.positionerEl.appendChild(this.contentEl)

    this.itemElements = {} as Record<MenuItem['value'], HTMLLIElement>
    // Keep Export last among data-part=item so ArrowUp / loopFocus stay stable.
    for (const item of items.slice(0, 3)) {
      const element = document.createElement('li')
      element.textContent = item.label
      this.itemElements[item.value] = element
      this.contentEl.appendChild(element)
    }

    this.shareTriggerEl = document.createElement('li')
    this.shareTriggerEl.textContent = 'Share'
    this.contentEl.appendChild(this.shareTriggerEl)

    this.boldOptionEl = document.createElement('li')
    this.boldOptionEl.textContent = 'Bold'
    this.alignLeftEl = document.createElement('li')
    this.alignLeftEl.textContent = 'Align Left'
    this.alignCenterEl = document.createElement('li')
    this.alignCenterEl.textContent = 'Align Center'
    if (this.includeOptions) {
      this.contentEl.append(this.boldOptionEl, this.alignLeftEl, this.alignCenterEl)
    }

    const exportItem = items[3]
    const exportEl = document.createElement('li')
    exportEl.textContent = exportItem.label
    this.itemElements[exportItem.value] = exportEl
    this.contentEl.appendChild(exportEl)
  }

  initService(context: menu.Context) {
    return menu.machine(context) as menu.Service
  }

  initApi() {
    return menu.connect(this.service.state, this.service.send, normalizeProps)
  }

  getService() {
    return this.service
  }

  getApi() {
    return this.api
  }

  setChildApiProvider(provider: () => menu.Api) {
    this.childApiProvider = provider
  }

  refresh() {
    this.updateApi()
    this.render()
  }

  onStateChange(listener: (state: MenuState) => void) {
    this.stateListeners.add(listener)
    return () => this.stateListeners.delete(listener)
  }

  protected override onTransition(state: MenuState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  override destroy(): void {
    this.stateListeners.clear()
    this.detachMenu()
    super.destroy()
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

  private syncOptionStatus() {
    if (!this.optionStatusEl)
      return
    this.optionStatusEl.dataset.bold = String(this.boldChecked)
    this.optionStatusEl.dataset.align = this.alignValue
    this.optionStatusEl.textContent = `bold=${this.boldChecked};align=${this.alignValue}`
  }

  render = () => {
    const api = this.api

    if (this.triggerEl) {
      spreadProps(this.triggerEl, {
        ...api.getTriggerProps(),
        'data-testid': 'menu:trigger',
      })
    }

    if (this.contextTriggerEl) {
      spreadProps(this.contextTriggerEl, {
        ...api.getContextTriggerProps(),
        'data-testid': 'menu:context-trigger',
      })
    }

    if (this.indicatorEl)
      spreadProps(this.indicatorEl, api.getIndicatorProps())

    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, {
      ...api.getContentProps(),
      'data-testid': this.contentTestId,
    })

    items.forEach((item) => {
      const element = this.itemElements[item.value]
      spreadProps(element, api.getItemProps({ value: item.value }))
    })

    if (this.childApiProvider) {
      spreadProps(this.shareTriggerEl, {
        ...api.getTriggerItemProps(this.childApiProvider()),
        'data-testid': 'menu:share-trigger',
      })
      this.shareTriggerEl.hidden = false
    }
    else {
      this.shareTriggerEl.hidden = true
    }

    if (this.includeOptions) {
      const boldOption = {
        type: 'checkbox' as const,
        value: 'bold',
        checked: this.boldChecked,
        valueText: 'Bold',
        closeOnSelect: false,
        onCheckedChange: (checked: boolean) => {
          this.boldChecked = checked
          this.syncOptionStatus()
        },
      }
      spreadProps(this.boldOptionEl, {
        ...api.getOptionItemProps(boldOption),
        'data-testid': 'menu:option-bold',
      })

      const alignLeft = {
        type: 'radio' as const,
        value: 'left',
        checked: this.alignValue === 'left',
        valueText: 'Align Left',
        closeOnSelect: false,
        onCheckedChange: (checked: boolean) => {
          if (checked)
            this.alignValue = 'left'
          this.syncOptionStatus()
        },
      }
      spreadProps(this.alignLeftEl, {
        ...api.getOptionItemProps(alignLeft),
        'data-testid': 'menu:option-align-left',
      })

      const alignCenter = {
        type: 'radio' as const,
        value: 'center',
        checked: this.alignValue === 'center',
        valueText: 'Align Center',
        closeOnSelect: false,
        onCheckedChange: (checked: boolean) => {
          if (checked)
            this.alignValue = 'center'
          this.syncOptionStatus()
        },
      }
      spreadProps(this.alignCenterEl, {
        ...api.getOptionItemProps(alignCenter),
        'data-testid': 'menu:option-align-center',
      })
    }

    this.syncOptionStatus()

    if (api.open)
      this.attachMenu()
    else
      this.detachMenu()
  }
}

class ShareMenuExample extends Component<
  menu.Context,
  menu.Api,
  MenuMachineContext,
  MachineState
> {
  private readonly positionerEl: HTMLDivElement
  private readonly contentEl: HTMLUListElement
  private readonly itemElements: Record<string, HTMLLIElement> = {}
  private readonly stateListeners = new Set<(state: MenuState) => void>()
  private isMounted = false

  constructor(rootEl: HTMLElement, context: menu.Context, options?: any) {
    super(rootEl, context, options)
    this.positionerEl = document.createElement('div')
    this.contentEl = document.createElement('ul')
    this.positionerEl.appendChild(this.contentEl)

    for (const item of shareItems) {
      const element = document.createElement('li')
      element.textContent = item.label
      this.itemElements[item.value] = element
      this.contentEl.appendChild(element)
    }
  }

  initService(context: menu.Context) {
    return menu.machine(context) as menu.Service
  }

  initApi() {
    return menu.connect(this.service.state, this.service.send, normalizeProps)
  }

  getService() {
    return this.service
  }

  getApi() {
    return this.api
  }

  refresh() {
    this.updateApi()
    this.render()
  }

  onStateChange(listener: (state: MenuState) => void) {
    this.stateListeners.add(listener)
    return () => this.stateListeners.delete(listener)
  }

  protected override onTransition(state: MenuState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  override destroy(): void {
    this.stateListeners.clear()
    this.detachMenu()
    super.destroy()
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
    spreadProps(this.positionerEl, api.getPositionerProps())
    spreadProps(this.contentEl, {
      ...api.getContentProps(),
      'data-testid': 'menu-share:content',
    })

    for (const item of shareItems) {
      spreadProps(this.itemElements[item.value], api.getItemProps({ value: item.value }))
    }

    if (api.open)
      this.attachMenu()
    else
      this.detachMenu()
  }
}

export function render(target: HTMLElement): () => void {
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
      <div data-menu-context-trigger style="margin-top: 12px;">
        Right click here
      </div>
      <div data-testid="option-status" data-option-status data-bold="false" data-align="left">bold=false;align=left</div>
      <div data-menu-share-root hidden></div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-menu-example]')
  const shareRoot = layout.main.querySelector<HTMLElement>('[data-menu-share-root]')
  if (!scope || !shareRoot)
    return () => {}

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const parent = new MenuExample(scope, {
    id: 'menu:vanilla',
  }, {
    context: {
      get: () => controls.context as Partial<MenuMachineContext>,
      subscribe: (fn: (ctx: Partial<MenuMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  const share = new ShareMenuExample(shareRoot, {
    'id': 'menu:vanilla:share',
    'aria-label': 'Share',
  })

  parent.init()
  share.init()

  parent.setChildApiProvider(() => share.getApi())
  parent.getApi().setChild(share.getService())
  share.getApi().setParent(parent.getService())
  parent.refresh()

  const unsubParent = parent.onStateChange((state) => {
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
    share.refresh()
  })
  const unsubShare = share.onStateChange(() => {
    parent.refresh()
  })

  toolbar.setVisualizerSlot(() => StateVisualizer({ state: parent.state as MenuState }))

  return () => {
    unsubParent?.()
    unsubShare?.()
    share.destroy()
    parent.destroy()
  }
}
