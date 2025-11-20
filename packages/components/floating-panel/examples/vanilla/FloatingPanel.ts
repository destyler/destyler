import type { ContextFrom } from '@destyler/vanilla'
import type { State as FloatingPanelState, MachineState } from '../../src/types'
import { floatingPanelControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as floatingPanel from '../../index'
import '../style.css'

type FloatingPanelMachineContext = ContextFrom<typeof floatingPanel.machine>

class FloatingPanelExample extends Component<
  floatingPanel.Context,
  floatingPanel.Api,
  FloatingPanelMachineContext,
  MachineState
> {
  private readonly triggerEl = this.rootEl.querySelector<HTMLButtonElement>('[data-floating-panel-trigger]')
  private readonly positionerEl = this.rootEl.querySelector<HTMLElement>('[data-floating-panel-positioner]')
  private readonly contentEl = this.rootEl.querySelector<HTMLElement>('[data-floating-panel-content]')
  private readonly dragTriggerEl = this.rootEl.querySelector<HTMLElement>('[data-floating-panel-drag-trigger]')
  private readonly headerEl = this.rootEl.querySelector<HTMLElement>('[data-floating-panel-header]')
  private readonly titleEl = this.rootEl.querySelector<HTMLElement>('[data-floating-panel-title]')
  private readonly bodyEl = this.rootEl.querySelector<HTMLElement>('[data-floating-panel-body]')
  private readonly minimizeTrigger = this.rootEl.querySelector<HTMLButtonElement>('[data-floating-panel-minimize]')
  private readonly maximizeTrigger = this.rootEl.querySelector<HTMLButtonElement>('[data-floating-panel-maximize]')
  private readonly restoreTrigger = this.rootEl.querySelector<HTMLButtonElement>('[data-floating-panel-restore]')
  private readonly closeTrigger = this.rootEl.querySelector<HTMLButtonElement>('[data-floating-panel-close]')
  private readonly resizeTriggers = Array.from(
    this.rootEl.querySelectorAll<HTMLElement>('[data-floating-panel-resize-trigger]'),
  ).map(element => ({
    element,
    axis: element.dataset.axis as floatingPanel.ResizeTriggerAxis,
  }))

  private readonly stateListeners = new Set<(state: FloatingPanelState) => void>()

  initService(context: floatingPanel.Context) {
    return floatingPanel.machine(context) as floatingPanel.Service
  }

  initApi() {
    return floatingPanel.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: FloatingPanelState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: FloatingPanelState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.triggerEl)
      spreadProps(this.triggerEl, api.getTriggerProps())

    if (this.positionerEl)
      spreadProps(this.positionerEl, api.getPositionerProps())

    if (this.contentEl)
      spreadProps(this.contentEl, api.getContentProps())

    if (this.dragTriggerEl)
      spreadProps(this.dragTriggerEl, api.getDragTriggerProps())

    if (this.headerEl)
      spreadProps(this.headerEl, api.getHeaderProps())

    if (this.titleEl)
      spreadProps(this.titleEl, api.getTitleProps())

    if (this.bodyEl)
      spreadProps(this.bodyEl, api.getBodyProps())

    if (this.minimizeTrigger)
      spreadProps(this.minimizeTrigger, api.getMinimizeTriggerProps())

    if (this.maximizeTrigger)
      spreadProps(this.maximizeTrigger, api.getMaximizeTriggerProps())

    if (this.restoreTrigger)
      spreadProps(this.restoreTrigger, api.getRestoreTriggerProps())

    if (this.closeTrigger)
      spreadProps(this.closeTrigger, api.getCloseTriggerProps())

    this.resizeTriggers.forEach(({ element, axis }) => {
      if (!element || !axis)
        return
      spreadProps(element, api.getResizeTriggerProps({ axis }))
    })
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(floatingPanelControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <div data-testid="outside">outside</div>
    <main class="floating-panel">
      <div data-floating-panel-example>
        <button type="button" data-testid="floating-panel:trigger" data-floating-panel-trigger>Toggle Panel</button>
        <div data-floating-panel-positioner>
          <div data-testid="floating-panel:content" data-floating-panel-content>
            <div data-floating-panel-drag-trigger>
              <div data-floating-panel-header>
                <p data-floating-panel-title>Floating Panel</p>
                <div data-scope="floating-panel" data-part="trigger-group">
                  <button type="button" data-floating-panel-minimize>_</button>
                  <button type="button" data-floating-panel-maximize>+</button>
                  <button type="button" data-floating-panel-restore>&#9633;</button>
                  <button type="button" data-floating-panel-close>x</button>
                </div>
              </div>
            </div>
            <div data-floating-panel-body>
              <p>Some content</p>
            </div>

            <div data-floating-panel-resize-trigger data-axis="n"></div>
            <div data-floating-panel-resize-trigger data-axis="e"></div>
            <div data-floating-panel-resize-trigger data-axis="w"></div>
            <div data-floating-panel-resize-trigger data-axis="s"></div>
            <div data-floating-panel-resize-trigger data-axis="ne"></div>
            <div data-floating-panel-resize-trigger data-axis="se"></div>
            <div data-floating-panel-resize-trigger data-axis="sw"></div>
            <div data-floating-panel-resize-trigger data-axis="nw"></div>
          </div>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-floating-panel-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new FloatingPanelExample(
    scope,
    { id: 'floating-panel:vanilla' },
    {
      context: {
        get: () => controls.context as Partial<FloatingPanelMachineContext>,
        subscribe: (fn: (ctx: Partial<FloatingPanelMachineContext>) => void) => controls.subscribe(fn as any),
      },
    },
  )

  instance.init()

  const updateVisualizer = (state?: FloatingPanelState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as FloatingPanelState)
  instance.onStateChange(updateVisualizer)
}
