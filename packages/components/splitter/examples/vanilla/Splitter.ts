import type { ContextFrom } from '@destyler/vanilla'
import type { State as SplitterState } from '../../src/types'
import { splitterControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as splitter from '../../index'
import '../style.css'

type SplitterMachineContext = ContextFrom<typeof splitter.machine>
type SplitterService = ReturnType<typeof splitter.machine>
type SplitterSnapshot = Parameters<typeof splitter.connect>[0]

class SplitterExample extends Component<splitter.Context, splitter.Api, SplitterMachineContext> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-splitter-root]')
  private readonly panelEls = Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-panel-id]'))
  private readonly resizeEls = Array.from(this.rootEl.querySelectorAll<HTMLElement>('[data-resize-id]'))
  private readonly stateListeners = new Set<(state: SplitterState) => void>()

  initService(context: splitter.Context) {
    return splitter.machine(context) as SplitterService
  }

  initApi() {
    return splitter.connect(this.service.state as SplitterSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: SplitterState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: SplitterState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    this.panelEls.forEach((panel) => {
      const id = panel.dataset.panelId
      if (!id)
        return
      spreadProps(panel, api.getPanelProps({ id }))
    })

    this.resizeEls.forEach((handle) => {
      const id = handle.dataset.resizeId as splitter.ResizeTriggerProps['id'] | undefined
      if (!id)
        return
      spreadProps(handle, api.getResizeTriggerProps({ id }))
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(splitterControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main class="splitter" style="min-width: 400px; min-height: 200px;">
      <div data-splitter-example>
        <div data-splitter-root>
          <div data-panel-id="a">
            <p>A</p>
          </div>
          <div data-resize-id="a:b" data-splitter-resize-trigger>
            <div class="bar"></div>
          </div>
          <div data-panel-id="b">
            <p>B</p>
          </div>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-splitter-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const contextSource = {
    get: () => controls.context as Partial<SplitterMachineContext>,
    subscribe: (fn: (ctx: Partial<SplitterMachineContext>) => void) => controls.subscribe(fn as any),
  }

  const instance = new SplitterExample(
    scope,
    {
      id: 'splitter:vanilla',
      size: [
        { id: 'a', size: 50 },
        { id: 'b', size: 50 },
      ],
    },
    { context: contextSource },
  )

  instance.init()

  const updateVisualizer = (state?: SplitterState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['previousPanels', 'initialSize'] }))
  }

  updateVisualizer(instance.state as SplitterState)
  instance.onStateChange(updateVisualizer)
}
