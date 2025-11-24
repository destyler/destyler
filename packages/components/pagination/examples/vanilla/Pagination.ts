import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as PaginationState } from '../../src/types'
import { paginationControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as pagination from '../../index'
import '../style.css'

type PaginationMachineContext = ContextFrom<typeof pagination.machine>

class PaginationExample extends Component<
  pagination.Context,
  pagination.Api,
  PaginationMachineContext,
  MachineState
> {
  private readonly navEl: HTMLElement | null
  private readonly listEl: HTMLUListElement | null
  private readonly prevTriggerEl: HTMLAnchorElement | null
  private readonly nextTriggerEl: HTMLAnchorElement | null

  private readonly stateListeners = new Set<(state: PaginationState) => void>()

  constructor(rootEl: HTMLElement, context: pagination.Context, options?: any) {
    super(rootEl, context, options)
    this.navEl = rootEl.querySelector('[data-pagination-root]')
    this.listEl = rootEl.querySelector('[data-pagination-list]')
    this.prevTriggerEl = rootEl.querySelector('[data-pagination-prev-trigger]')
    this.nextTriggerEl = rootEl.querySelector('[data-pagination-next-trigger]')
  }

  initService(context: pagination.Context) {
    return pagination.machine(context) as pagination.Service
  }

  initApi() {
    return pagination.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: PaginationState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: PaginationState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private renderPages(api: pagination.Api) {
    if (!this.listEl)
      return

    const nextItem = this.listEl.querySelector('[data-pagination-next-item]')
    this.listEl.querySelectorAll('[data-pagination-dynamic]').forEach(node => node.remove())

    api.pages.forEach((page, index) => {
      const li = document.createElement('li')
      li.dataset.paginationDynamic = 'true'

      if (page.type === 'page') {
        const anchor = document.createElement('a')
        anchor.textContent = String(page.value)
        anchor.setAttribute('data-testid', `pagination-item-${page.value}:item`)
        spreadProps(anchor, api.getItemProps(page))
        li.appendChild(anchor)
      }
      else {
        const ellipsis = document.createElement('span')
        ellipsis.textContent = '…'
        spreadProps(ellipsis, api.getEllipsisProps({ index }))
        li.appendChild(ellipsis)
      }

      this.listEl?.insertBefore(li, nextItem ?? null)
    })
  }

  render = () => {
    const api = this.api

    if (this.navEl)
      spreadProps(this.navEl, api.getRootProps())

    if (this.prevTriggerEl)
      spreadProps(this.prevTriggerEl, api.getPrevTriggerProps())

    if (this.nextTriggerEl)
      spreadProps(this.nextTriggerEl, api.getNextTriggerProps())

    this.renderPages(api)
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(paginationControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main>
      <div data-pagination-example>
        <nav data-pagination-root>
          <ul data-pagination-list style="display: flex;">
            <li data-pagination-prev-item>
              <a data-pagination-prev-trigger data-testid="prev:trigger">⬅️</a>
            </li>
            <li data-pagination-next-item>
              <a data-pagination-next-trigger data-testid="next:trigger">➡️</a>
            </li>
          </ul>
        </nav>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-pagination-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new PaginationExample(scope, { id: 'pagination:vanilla', count: 1000 }, {
    context: {
      get: () => controls.context as Partial<PaginationMachineContext>,
      subscribe: (fn: (ctx: Partial<PaginationMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: PaginationState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as PaginationState)
  instance.onStateChange(updateVisualizer)
}
