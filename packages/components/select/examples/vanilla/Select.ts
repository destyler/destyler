import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as SelectState } from '../../src/types'
import { selectControls, selectData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as select from '../../index'
import '../style.css'

type SelectMachineContext = ContextFrom<typeof select.machine>
type SelectItem = (typeof selectData)[number]

interface ItemNodes {
  item: SelectItem
  element: HTMLLIElement
  textEl: HTMLSpanElement
  indicatorEl: HTMLSpanElement
}

function createCollection() {
  return select.collection({ items: selectData })
}

class SelectExample extends Component<
  select.Context,
  select.Api,
  SelectMachineContext,
  MachineState
> {
  private collection = createCollection()
  private readonly stateListeners = new Set<(state: SelectState) => void>()

  private rootNode: HTMLElement | null = null
  private labelEl: HTMLLabelElement | null = null
  private controlEl: HTMLElement | null = null
  private triggerEl: HTMLButtonElement | null = null
  private valueTextEl: HTMLElement | null = null
  private indicatorEl: HTMLElement | null = null
  private clearTriggerEl: HTMLButtonElement | null = null
  private hiddenSelectEl: HTMLSelectElement | null = null
  private positionerEl: HTMLElement | null = null
  private contentEl: HTMLUListElement | null = null
  private itemNodes: ItemNodes[] = []

  constructor(rootEl: HTMLElement, context: select.Context, options?: any) {
    super(rootEl, context, options)

    this.collection = this.context.collection ?? this.collection

    this.rootNode = this.rootEl.querySelector('[data-select-root]')
    this.labelEl = this.rootEl.querySelector('[data-select-label]')
    this.controlEl = this.rootEl.querySelector('[data-select-control]')
    this.triggerEl = this.rootEl.querySelector('[data-select-trigger]') as HTMLButtonElement | null
    this.valueTextEl = this.rootEl.querySelector('[data-select-value-text]')
    this.indicatorEl = this.rootEl.querySelector('[data-select-indicator]')
    this.clearTriggerEl = this.rootEl.querySelector('[data-select-clear]') as HTMLButtonElement | null
    this.hiddenSelectEl = this.rootEl.querySelector('[data-select-hidden]') as HTMLSelectElement | null
    this.positionerEl = this.rootEl.querySelector('[data-select-positioner]')
    this.contentEl = this.rootEl.querySelector('[data-select-content]') as HTMLUListElement | null

    this.setupHiddenSelectOptions()
    this.setupItemNodes()
  }

  initService(context: select.Context) {
    return select.machine({
      ...context,
      collection: this.collection,
    }) as select.Service
  }

  initApi() {
    return select.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: SelectState) => void) {
    this.stateListeners.add(listener)
    return () => this.stateListeners.delete(listener)
  }

  protected override onTransition(state: SelectState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  override destroy(): void {
    this.stateListeners.clear()
    super.destroy()
  }

  private setupHiddenSelectOptions() {
    if (!this.hiddenSelectEl)
      return

    this.hiddenSelectEl.innerHTML = ''

    const emptyOption = document.createElement('option')
    emptyOption.value = ''
    this.hiddenSelectEl.appendChild(emptyOption)

    selectData.forEach((option) => {
      const optionEl = document.createElement('option')
      optionEl.value = option.value
      optionEl.textContent = option.label
      this.hiddenSelectEl!.appendChild(optionEl)
    })
  }

  private setupItemNodes() {
    if (!this.contentEl)
      return

    this.contentEl.innerHTML = ''
    this.itemNodes = selectData.map((item) => {
      const li = document.createElement('li')
      const textEl = document.createElement('span')
      textEl.textContent = item.label
      const indicatorEl = document.createElement('span')
      indicatorEl.textContent = '✓'

      li.dataset.testid = `${item.label}:item`
      li.appendChild(textEl)
      li.appendChild(indicatorEl)
      this.contentEl!.appendChild(li)

      return {
        item,
        element: li,
        textEl,
        indicatorEl,
      }
    })
  }

  private renderItems(api: select.Api) {
    this.itemNodes.forEach(({ item, element, textEl, indicatorEl }) => {
      spreadProps(element, api.getItemProps({ item }))
      spreadProps(textEl, api.getItemTextProps({ item }))
      spreadProps(indicatorEl, api.getItemIndicatorProps({ item }))
    })
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())

    if (this.controlEl)
      spreadProps(this.controlEl, api.getControlProps())

    if (this.triggerEl) {
      spreadProps(this.triggerEl, api.getTriggerProps())
    }

    if (this.valueTextEl) {
      spreadProps(this.valueTextEl, api.getValueTextProps())
      this.valueTextEl.textContent = api.valueAsString || 'Select option'
    }

    if (this.indicatorEl)
      spreadProps(this.indicatorEl, api.getIndicatorProps())

    if (this.clearTriggerEl)
      spreadProps(this.clearTriggerEl, api.getClearTriggerProps())

    if (this.hiddenSelectEl)
      spreadProps(this.hiddenSelectEl, api.getHiddenSelectProps())

    if (this.positionerEl)
      spreadProps(this.positionerEl, api.getPositionerProps())

    if (this.contentEl) {
      spreadProps(this.contentEl, api.getContentProps())
      this.renderItems(api)
    }
  }
}

export function render(target: HTMLElement): () => void {
  const controls = useControls(selectControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-testid="outside">out side</div>
    <main class="select">
      <div data-select-example>
        <div data-select-root>
          <label data-select-label data-testid="select:label">Label</label>
          <div data-select-control>
            <button type="button" data-testid="select:trigger" data-select-trigger>
              <span data-select-value-text>Select option</span>
              <span aria-hidden="true" data-select-indicator>▼</span>
            </button>
            <button type="button" data-testid="select-clear:trigger" data-select-clear>X</button>
          </div>
          <form>
            <select data-select-hidden></select>
          </form>
          <div data-select-positioner>
            <ul data-testid="select:content" data-select-content></ul>
          </div>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-select-example]')
  if (!scope)
    return () => {}

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const collection = createCollection()
  const contextSource = {
    get: () => ({
      ...controls.context,
      collection,
    }),
    subscribe: (fn: (ctx: Partial<SelectMachineContext>) => void) =>
      controls.subscribe((ctx: Partial<SelectMachineContext>) => {
        fn({
          ...ctx,
          collection,
        })
      }),
  }

  const instance = new SelectExample(scope, { id: 'select:vanilla', name: 'country', collection }, { context: contextSource })
  instance.init()

  const updateVisualizer = (state?: SelectState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['collection'] }))
  }

  updateVisualizer(instance.state as SelectState)
  const unsubscribeVisualizer = instance.onStateChange(updateVisualizer)

  return () => {
    unsubscribeVisualizer?.()
    instance.destroy()
  }
}
