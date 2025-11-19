import type { ContextFrom } from '@destyler/vanilla'
import type { State as ComboboxState, MachineState } from '../../src/types'
import { comboboxControls, listData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as combobox from '../../index'
import '../style.css'

type ComboboxMachineContext = ContextFrom<typeof combobox.machine>
type Country = (typeof listData)[number]

function createCollection() {
  return combobox.collection({
    items: listData,
    itemToValue: item => item.code,
    itemToString: item => item.label,
  })
}

class ComboboxExample extends Component<
  combobox.Context,
  combobox.Api,
  ComboboxMachineContext,
  MachineState
> {
  private collection = this.context.collection ?? createCollection()
  private currentItems: Country[] = [...listData]
  private lastRenderedItems: Country[] = []

  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-combobox-root]')
  private readonly labelEl = this.rootEl.querySelector<HTMLLabelElement>('[data-combobox-label]')
  private readonly controlEl = this.rootEl.querySelector<HTMLElement>('[data-combobox-control]')
  private readonly inputEl = this.rootEl.querySelector<HTMLInputElement>('[data-combobox-input]')
  private readonly triggerEl = this.rootEl.querySelector<HTMLButtonElement>('[data-combobox-trigger]')
  private readonly positionerEl = this.rootEl.querySelector<HTMLElement>('[data-combobox-positioner]')
  private contentEl = this.rootEl.querySelector<HTMLUListElement>('[data-combobox-content]')
  private readonly clearButtons = Array.from(
    this.rootEl.querySelectorAll<HTMLButtonElement>('[data-combobox-clear-trigger], [data-combobox-inline-clear]'),
  )

  private readonly setValueButton = this.rootEl.querySelector<HTMLButtonElement>('[data-combobox-set-value]')
  private readonly clearValueButton = this.rootEl.querySelector<HTMLButtonElement>('[data-combobox-clear-value]')

  private readonly stateListeners = new Set<(state: ComboboxState) => void>()

  constructor(rootEl: HTMLElement, context: combobox.Context, options?: any) {
    super(rootEl, context, options)

    this.setValueButton?.addEventListener('click', () => {
      this.api?.setValue(['TG'])
    })

    this.clearValueButton?.addEventListener('click', () => {
      this.api?.clearValue()
    })
  }

  initService(context: combobox.Context) {
    return combobox.machine({
      ...context,
      collection: this.collection,
      openOnClick: true,
      onOpenChange: () => this.resetItems(),
      onInputValueChange: ({ inputValue }) => this.filterItems(inputValue),
    }) as combobox.Service
  }

  initApi() {
    return combobox.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: ComboboxState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: ComboboxState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private resetItems() {
    this.setFilteredItems(listData)
  }

  private filterItems(inputValue: string) {
    const filtered = listData.filter(item =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    )
    this.setFilteredItems(filtered.length > 0 ? filtered : listData)
  }

  private setFilteredItems(next: Country[]) {
    this.currentItems = [...next]
    this.collection.setItems(this.currentItems)
    this.api?.setCollection(this.collection)
  }

  private renderItems(api: combobox.Api) {
    if (!this.contentEl)
      return

    if (this.currentItems !== this.lastRenderedItems) {
      this.contentEl.innerHTML = ''
      this.lastRenderedItems = this.currentItems

      if (this.currentItems.length === 0)
        return

      this.currentItems.forEach((item) => {
        const li = document.createElement('li')
        spreadProps(li, {
          ...api.getItemProps({ item }),
          'data-testid': item.code,
        })

        const indicator = document.createElement('span')
        indicator.textContent = '✅'
        spreadProps(indicator, api.getItemIndicatorProps({ item }))

        const label = document.createElement('span')
        label.textContent = item.label

        li.append(indicator, label)
        this.contentEl!.appendChild(li)
      })
      return
    }

    // Update existing items
    const items = Array.from(this.contentEl.children) as HTMLElement[]

    // Remove extra items if any
    while (items.length > this.currentItems.length) {
      const item = items.pop()
      item?.remove()
    }

    this.currentItems.forEach((item, index) => {
      const li = items[index]
      if (!li)
return

      spreadProps(li, {
        ...api.getItemProps({ item }),
        'data-testid': item.code,
      })

      const indicator = li.firstElementChild as HTMLElement
      if (indicator) {
        spreadProps(indicator, api.getItemIndicatorProps({ item }))
      }
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
    if (this.inputEl) {
      spreadProps(this.inputEl, {
        ...api.getInputProps(),
        'data-testid': 'input',
      })
    }
    if (this.triggerEl) {
      spreadProps(this.triggerEl, {
        ...api.getTriggerProps(),
        'data-testid': 'trigger',
      })
    }
    this.clearButtons.forEach(button => spreadProps(button, api.getClearTriggerProps()))
    if (this.positionerEl)
      spreadProps(this.positionerEl, api.getPositionerProps())

    if (this.contentEl) {
      if (this.currentItems.length === 0) {
        this.contentEl.hidden = true
      }
      else {
        spreadProps(this.contentEl, {
          ...api.getContentProps(),
          'data-testid': 'combobox-content',
        })
        this.renderItems(api)
      }
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(comboboxControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="combobox">
      <div data-combobox-example>
        <button type="button" data-combobox-set-value>Set to Togo</button>
        <button type="button" data-testid="clear-value-button" data-combobox-clear-value>
          Clear Value
        </button>
        <button type="button" data-combobox-clear-trigger>
          Clear Trigger
        </button>
        <br />
        <div data-combobox-root>
          <label data-combobox-label>Select country</label>
          <div data-combobox-control>
            <input data-testid="input" data-combobox-input />
            <button type="button" data-testid="trigger" data-combobox-trigger>▼</button>
            <button type="button" data-combobox-inline-clear>
              x
            </button>
          </div>
        </div>
        <div data-combobox-positioner>
          <ul data-testid="combobox-content" data-combobox-content></ul>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-combobox-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const collection = createCollection()
  const contextSource = {
    get: () => {
      const {
        open,
        value,
        inputValue,
        highlightedValue,
        highlightedItem,
        selectedItems,
        ...rest
      } = controls.context
      return {
        ...rest,
        collection,
      }
    },
    subscribe: (fn: (ctx: Partial<ComboboxMachineContext>) => void) =>
      controls.subscribe((ctx: Partial<ComboboxMachineContext>) => {
        const {
          open,
          value,
          inputValue,
          highlightedValue,
          highlightedItem,
          selectedItems,
          ...rest
        } = ctx
        fn({
          ...rest,
          collection,
        })
      }),
  }

  const instance = new ComboboxExample(scope, { id: 'combobox:vanilla', collection }, { context: contextSource })
  instance.init()

  const updateVisualizer = (state?: ComboboxState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['collection'] }))
  }

  updateVisualizer(instance.state as ComboboxState)
  instance.onStateChange(updateVisualizer)
}
