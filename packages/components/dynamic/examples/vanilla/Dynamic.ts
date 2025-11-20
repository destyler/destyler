import type { ContextFrom } from '@destyler/vanilla'
import type { State as DynamicState, MachineState } from '../../src/types'
import { dynamicControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as dynamic from '../../index'
import '../style.css'

type DynamicMachineContext = ContextFrom<typeof dynamic.machine>

interface ItemNode {
  wrapper: HTMLSpanElement
  preview: HTMLDivElement
  label: HTMLSpanElement
  deleteTrigger: HTMLButtonElement
  input: HTMLInputElement
}

function toDashCase(value: string) {
  return value.replace(/\s+/g, '-').toLowerCase()
}

class DynamicExample extends Component<
  dynamic.Context,
  dynamic.Api,
  DynamicMachineContext,
  MachineState
> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-dynamic-root]')
  private readonly itemsContainer = this.rootEl.querySelector<HTMLElement>('[data-dynamic-items]')
  private readonly inputEl = this.rootEl.querySelector<HTMLInputElement>('[data-dynamic-input]')
  private readonly stateListeners = new Set<(state: DynamicState) => void>()
  private itemNodes: ItemNode[] = []

  initService(context: dynamic.Context) {
    return dynamic.machine(context)
  }

  initApi() {
    return dynamic.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: DynamicState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: DynamicState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  private ensureItemNodes(count: number) {
    if (!this.itemsContainer)
      return

    while (this.itemNodes.length < count) {
      const wrapper = document.createElement('span')
      const preview = document.createElement('div')
      const label = document.createElement('span')
      const deleteTrigger = document.createElement('button')
      const input = document.createElement('input')

      deleteTrigger.type = 'button'
      deleteTrigger.textContent = '✕'

      preview.append(label, deleteTrigger)
      wrapper.append(preview, input)
      this.itemsContainer.appendChild(wrapper)

      this.itemNodes.push({ wrapper, preview: preview as HTMLDivElement, label, deleteTrigger, input })
    }

    while (this.itemNodes.length > count) {
      const item = this.itemNodes.pop()
      item?.wrapper.remove()
    }
  }

  private renderItems(api: dynamic.Api) {
    if (!this.itemsContainer)
      return

    this.ensureItemNodes(api.value.length)

    api.value.forEach((value, index) => {
      const nodes = this.itemNodes[index]
      if (!nodes)
        return

      const dash = toDashCase(value)

      spreadProps(nodes.wrapper, api.getItemProps({ index, value }))
      nodes.wrapper.style.position = 'relative'

      spreadProps(nodes.preview, {
        ...api.getItemPreviewProps({ index, value }),
        'data-testid': `${dash}-input`,
      })

      nodes.label.textContent = value

      spreadProps(nodes.deleteTrigger, {
        ...api.getItemDeleteTriggerProps({ index, value }),
        'data-testid': `${dash}-delete-trigger`,
      })
      nodes.deleteTrigger.textContent = '✕'

      spreadProps(nodes.input, {
        ...api.getItemInputProps({ index, value }),
        'data-testid': `${dash}-item-input`,
      })
    })
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    this.renderItems(api)

    if (this.inputEl) {
      spreadProps(this.inputEl, {
        ...api.getInputProps(),
        'placeholder': 'Add tag...',
        'data-testid': 'dynamic:input',
      })
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(dynamicControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main>
      <div data-dynamic-example>
        <input data-dynamic-copy data-testid="copy-text" style="margin-bottom: 1rem;" />
        <div data-dynamic-root>
          <div data-dynamic-items></div>
          <input data-dynamic-input />
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-dynamic-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new DynamicExample(scope, {
    id: 'dynamic:vanilla',
    value: ['React', 'Vue'],
  }, {
    context: {
      get: () => controls.context as Partial<DynamicMachineContext>,
      subscribe: (fn: (ctx: Partial<DynamicMachineContext>) => void) => controls.subscribe(fn),
    },
  })

  instance.init()

  const updateVisualizer = (state?: DynamicState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as DynamicState)
  instance.onStateChange(updateVisualizer)
}
