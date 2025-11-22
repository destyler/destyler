import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as TabsState } from '../../src/types'
import { tabsControls, tabsData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as tabs from '../../index'
import '../style.css'

type TabsMachineContext = ContextFrom<typeof tabs.machine>

interface TriggerNode {
  value: string
  element: HTMLButtonElement
}

interface ContentNode {
  value: string
  element: HTMLElement
}

class TabsExample extends Component<tabs.Context, tabs.Api, TabsMachineContext, MachineState> {
  private readonly rootNode: HTMLElement | null
  private readonly indicatorEl: HTMLElement | null
  private readonly listEl: HTMLElement | null
  private readonly triggerNodes: TriggerNode[]
  private readonly contentNodes: ContentNode[]
  private readonly stateListeners = new Set<(state: TabsState) => void>()

  constructor(rootEl: HTMLElement, context: tabs.Context, options?: any) {
    super(rootEl, context, options)

    this.rootNode = rootEl.querySelector('[data-tabs-root]')
    this.indicatorEl = rootEl.querySelector('[data-tabs-indicator]')
    this.listEl = rootEl.querySelector('[data-tabs-list]')
    this.triggerNodes = Array.from(rootEl.querySelectorAll<HTMLButtonElement>('[data-tabs-trigger]')).map(element => ({
      value: element.dataset.tabsTrigger ?? '',
      element,
    }))
    this.contentNodes = Array.from(rootEl.querySelectorAll<HTMLElement>('[data-tabs-content]')).map(element => ({
      value: element.dataset.tabsContent ?? '',
      element,
    }))
  }

  initService(context: tabs.Context) {
    return tabs.machine(context) as tabs.Service
  }

  initApi() {
    return tabs.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: TabsState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: TabsState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api
    if (!api)
      return

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.indicatorEl)
      spreadProps(this.indicatorEl, api.getIndicatorProps())

    if (this.listEl)
      spreadProps(this.listEl, api.getListProps())

    this.triggerNodes.forEach(({ value, element }) => {
      spreadProps(element, {
        ...api.getTriggerProps({ value }),
        'data-testid': `${value}-tab`,
      })
    })

    this.contentNodes.forEach(({ value, element }) => {
      spreadProps(element, {
        ...api.getContentProps({ value }),
        'data-testid': `${value}-tab-panel`,
      })
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(tabsControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  const triggersMarkup = tabsData
    .map(data => `
      <button type="button" data-tabs-trigger="${data.id}" data-testid="${data.id}-tab">
        ${data.label}
      </button>
    `)
    .join('')

  const contentsMarkup = tabsData
    .map(data => `
      <div data-tabs-content="${data.id}" data-testid="${data.id}-tab-panel">
        <p>
          ${data.content}
        </p>
        ${data.id === 'agnes' ? '<input placeholder="Agnes" />' : ''}
      </div>
    `)
    .join('')

  layout.main.innerHTML = `
    <main>
      <div data-tabs-example>
        <div data-tabs-root>
          <div data-tabs-indicator></div>
          <div data-tabs-list>
            ${triggersMarkup}
          </div>
          ${contentsMarkup}
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-tabs-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new TabsExample(scope, { id: 'tabs:vanilla', value: 'nils' }, {
    context: {
      get: () => controls.context as Partial<TabsMachineContext>,
      subscribe: (fn: (ctx: Partial<TabsMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })
  instance.init()

  const updateVisualizer = (state?: TabsState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as TabsState)
  instance.onStateChange(updateVisualizer)
}
