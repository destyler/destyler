import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as NumberInputState } from '../../src/types'
import { numberInputControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as numberInput from '../../index'
import '../style.css'

type NumberInputMachineContext = ContextFrom<typeof numberInput.machine>

class NumberInputExample extends Component<
  numberInput.Context,
  numberInput.Api,
  NumberInputMachineContext,
  MachineState
> {
  private readonly rootNode: HTMLElement | null
  private readonly scrubberEl: HTMLElement | null
  private readonly labelEl: HTMLLabelElement | null
  private readonly controlEl: HTMLElement | null
  private readonly decrementButton: HTMLButtonElement | null
  private readonly incrementButton: HTMLButtonElement | null
  private readonly inputEl: HTMLInputElement | null

  private readonly stateListeners = new Set<(state: NumberInputState) => void>()

  constructor(rootEl: HTMLElement, context: numberInput.Context, options?: any) {
    super(rootEl, context, options)
    this.rootNode = rootEl.querySelector('[data-number-input-root]')
    this.scrubberEl = rootEl.querySelector('[data-number-input-scrubber]')
    this.labelEl = rootEl.querySelector('[data-number-input-label]')
    this.controlEl = rootEl.querySelector('[data-number-input-control]')
    this.inputEl = rootEl.querySelector('[data-number-input-input]')
    this.decrementButton = rootEl.querySelector('[data-number-input-decrement]')
    this.incrementButton = rootEl.querySelector('[data-number-input-increment]')
  }

  initService(context: numberInput.Context) {
    return numberInput.machine(context) as numberInput.Service
  }

  initApi() {
    return numberInput.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: NumberInputState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: NumberInputState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.scrubberEl)
      spreadProps(this.scrubberEl, api.getScrubberProps())

    if (this.labelEl) {
      spreadProps(this.labelEl, api.getLabelProps())
      this.labelEl.textContent = 'Enter number:'
    }

    if (this.controlEl)
      spreadProps(this.controlEl, api.getControlProps())

    if (this.decrementButton)
      spreadProps(this.decrementButton, api.getDecrementTriggerProps())

    if (this.incrementButton)
      spreadProps(this.incrementButton, api.getIncrementTriggerProps())

    if (this.inputEl)
      spreadProps(this.inputEl, api.getInputProps())
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(numberInputControls)
  const layout = Layout()

  target.innerHTML = ''
  target.appendChild(layout.root)

  layout.main.innerHTML = `
    <main>
      <div data-testid="outside">out side</div>
      <div data-number-input-example>
        <div data-number-input-root>
          <div data-testid="scrubber" data-number-input-scrubber></div>
          <label data-testid="label" data-number-input-label>Enter number:</label>
          <div data-number-input-control>
            <button data-testid="dec:trigger" data-number-input-decrement>DEC</button>
            <input data-testid="number-input:input" data-number-input-input />
            <button data-testid="inc:trigger" data-number-input-increment>INC</button>
          </div>
        </div>
      </div>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-number-input-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new NumberInputExample(scope, { id: 'number-input:vanilla' }, {
    context: {
      get: () => controls.context as Partial<NumberInputMachineContext>,
      subscribe: (fn: (ctx: Partial<NumberInputMachineContext>) => void) => controls.subscribe(fn),
    },
  })
  instance.init()

  const updateVisualizer = (state?: NumberInputState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state, omit: ['formatter', 'parser'] }))
  }

  updateVisualizer(instance.state as NumberInputState)
  instance.onStateChange(updateVisualizer)
}
