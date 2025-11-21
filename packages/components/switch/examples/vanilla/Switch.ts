import type { ContextFrom } from '@destyler/vanilla'
import { switchControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as switchs from '../../index'
import '../style.css'

type SwitchMachineContext = ContextFrom<typeof switchs.machine>
type SwitchService = ReturnType<typeof switchs.machine>
type SwitchState = ReturnType<SwitchService['getState']>
type SwitchSnapshot = Parameters<typeof switchs.connect>[0]

class SwitchExample extends Component<
  switchs.Context,
  switchs.Api,
  SwitchMachineContext
> {
  private readonly rootLabel: HTMLLabelElement
  private readonly hiddenInput: HTMLInputElement | null
  private readonly controlEl: HTMLElement | null
  private readonly thumbEl: HTMLElement | null
  private readonly labelEl: HTMLElement | null

  private readonly stateListeners = new Set<(state: SwitchState) => void>()

  constructor(rootEl: HTMLElement, context: switchs.Context, options?: any) {
    super(rootEl, context, options)
    this.rootLabel = rootEl as HTMLLabelElement
    this.hiddenInput = rootEl.querySelector('[data-switch-hidden]')
    this.controlEl = rootEl.querySelector('[data-switch-control]')
    this.thumbEl = rootEl.querySelector('[data-switch-thumb]')
    this.labelEl = rootEl.querySelector('[data-switch-label]')
  }

  initService(context: switchs.Context) {
    return switchs.machine(context)
  }

  initApi() {
    return switchs.connect(this.service.state as SwitchSnapshot, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: SwitchState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: SwitchState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    spreadProps(this.rootLabel, this.api.getRootProps())

    if (this.hiddenInput) {
      spreadProps(this.hiddenInput, {
        ...this.api.getHiddenInputProps(),
        'data-testid': 'hidden-input',
      })
    }

    if (this.controlEl)
      spreadProps(this.controlEl, this.api.getControlProps())

    if (this.thumbEl)
      spreadProps(this.thumbEl, this.api.getThumbProps())

    if (this.labelEl) {
      spreadProps(this.labelEl, this.api.getLabelProps())
      this.labelEl.textContent = `Feature is ${this.api.checked ? 'enabled' : 'disabled'}`
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(switchControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <label data-switch-root>
      <input data-switch-hidden />
      <span data-switch-control>
        <span data-switch-thumb></span>
      </span>
      <span data-switch-label>Feature is disabled</span>
    </label>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-switch-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new SwitchExample(rootEl, { id: 'switch:vanilla', name: 'switch' }, {
    context: {
      get: () => controls.context as Partial<SwitchMachineContext>,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })

  instance.init()

  const updateVisualizer = (state?: SwitchState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as SwitchState)
  instance.onStateChange(updateVisualizer)
}
