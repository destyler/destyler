import type { ContextFrom } from '@destyler/vanilla'
import { checkboxControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as checkbox from '../../index'
import '../style.css'

type CheckboxMachineContext = ContextFrom<typeof checkbox.machine>

const classNames = (...values: Array<string | null | undefined | false>) => values.filter(Boolean).join(' ')

class CheckboxExample extends Component<
  checkbox.Context,
  checkbox.Api,
  CheckboxMachineContext,
  checkbox.MachineState
> {
  private readonly rootLabelEl: HTMLLabelElement
  private readonly controlEl: HTMLElement | null
  private readonly labelEl: HTMLElement | null
  private readonly inputEl: HTMLInputElement | null

  private readonly stateListeners = new Set<(state: checkbox.State) => void>()

  constructor(rootEl: HTMLElement, context: checkbox.Context, options?: any) {
    super(rootEl, context, options)
    this.rootLabelEl = rootEl as HTMLLabelElement
    this.controlEl = rootEl.querySelector<HTMLElement>('[data-checkbox-control]')
    this.labelEl = rootEl.querySelector<HTMLElement>('[data-checkbox-label]')
    this.inputEl = rootEl.querySelector<HTMLInputElement>('[data-checkbox-input]')
  }

  initService(context: checkbox.Context) {
    return checkbox.machine(context) as checkbox.Service
  }

  initApi() {
    return checkbox.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: checkbox.State) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: checkbox.State) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const rootProps = this.api.getRootProps()
    spreadProps(this.rootLabelEl, {
      ...rootProps,
      class: classNames('checkbox-root', rootProps.class),
    })

    if (this.controlEl) {
      const controlProps = this.api.getControlProps()
      spreadProps(this.controlEl, {
        ...controlProps,
        class: classNames('checkbox-control', controlProps.class),
      })
    }

    if (this.labelEl) {
      const labelProps = this.api.getLabelProps()
      spreadProps(this.labelEl, {
        ...labelProps,
        class: classNames('checkbox-label', labelProps.class),
      })

      // Update label text
      this.labelEl.innerHTML = `Input is ${this.api.checked ? ' checked' : ' unchecked'}`
    }

    if (this.inputEl) {
      const inputProps = this.api.getHiddenInputProps()
      spreadProps(this.inputEl, {
        ...inputProps,
      })
    }
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(checkboxControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <label data-checkbox-root class="checkbox-root">
      <div data-checkbox-control class="checkbox-control"></div>
      <span data-checkbox-label class="checkbox-label">
        Input is unchecked
      </span>
      <input data-testid="hidden-input" data-checkbox-input />
    </label>
  `

  const rootEl = layout.main.querySelector<HTMLElement>('[data-checkbox-root]')
  if (!rootEl)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new CheckboxExample(rootEl, { id: 'checkbox:vanilla' }, {
    context: {
      get: () => controls.context as Partial<CheckboxMachineContext>,
      subscribe: (fn: any) => controls.subscribe(fn),
    },
  })
  instance.init()

  const updateVisualizer = (state?: checkbox.State) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as checkbox.State)
  instance.onStateChange(updateVisualizer)
}
