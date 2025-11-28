import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as ToggleState } from '../../src/types'
import { toggleControls, toggleData } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as toggle from '../../index'
import '../style.css'

type ToggleMachineContext = ContextFrom<typeof toggle.machine>

type ToggleSnapshot = Parameters<typeof toggle.connect>[0]

class ToggleExample extends Component<toggle.Context, toggle.Api, ToggleMachineContext, MachineState> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-toggle-root]')
  private readonly itemButtons = Array.from(this.rootEl.querySelectorAll<HTMLButtonElement>('[data-toggle-item]'))
  private readonly stateListeners = new Set<(state: ToggleState) => void>()

  initService(context: toggle.Context) {
    return toggle.machine(context) as toggle.Service
  }

  initApi() {
    return toggle.connect(this.service.state as ToggleSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: ToggleState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: ToggleState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    this.itemButtons.forEach((button) => {
      const value = button.dataset.value
      if (!value)
        return
      spreadProps(button, api.getItemProps({ value }))
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(toggleControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="toggle-group">
      <div data-toggle-example>
        <button type="button" data-toggle-outside>Outside</button>
        <div data-toggle-root>
          ${toggleData.map(item => `<button type="button" data-toggle-item data-value="${item.value}">${item.label}</button>`).join('')}
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-toggle-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new ToggleExample(scope, { id: 'toggle:vanilla' }, {
    context: {
      get: () => controls.context as Partial<ToggleMachineContext>,
      subscribe: (fn: (ctx: Partial<ToggleMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })

  instance.init()

  const updateVisualizer = (state?: ToggleState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as ToggleState)
  instance.onStateChange(updateVisualizer)
}
