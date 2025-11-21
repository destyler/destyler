import type { ContextFrom } from '@destyler/vanilla'
import type { MachineState, State as OtpInputState } from '../../src/types'
import { otpInputControls } from '@destyler/shared-private'
import { Controls as ControlsPanel, Layout, StateVisualizer, Toolbar, useControls } from '@destyler/shared-private/vanilla'
import { Component, normalizeProps, spreadProps } from '@destyler/vanilla'
import * as otpInput from '../../index'
import '../style.css'

type OtpInputMachineContext = ContextFrom<typeof otpInput.machine>
const INPUT_LENGTH = 3

class OtpInputExample extends Component<
  otpInput.Context,
  otpInput.Api,
  OtpInputMachineContext,
  MachineState
> {
  private readonly rootNode = this.rootEl.querySelector<HTMLElement>('[data-otp-root]')
  private readonly labelEl = this.rootEl.querySelector<HTMLLabelElement>('[data-otp-label]')
  private readonly controlEl = this.rootEl.querySelector<HTMLElement>('[data-otp-control]')
  private readonly inputEls = Array.from(this.rootEl.querySelectorAll<HTMLInputElement>('[data-otp-input]'))
  private readonly hiddenInput = this.rootEl.querySelector<HTMLInputElement>('[data-otp-hidden]')
  private readonly clearButton = this.rootEl.querySelector<HTMLButtonElement>('[data-otp-clear]')

  private readonly stateListeners = new Set<(state: OtpInputState) => void>()

  constructor(rootEl: HTMLElement, context: otpInput.Context, options?: any) {
    super(rootEl, context, options)
    this.clearButton?.addEventListener('click', () => {
      this.api?.clearValue()
    })
  }

  initService(context: otpInput.Context) {
    return otpInput.machine(context)
  }

  initApi() {
    return otpInput.connect(this.service.state, this.service.send, normalizeProps)
  }

  onStateChange(listener: (state: OtpInputState) => void) {
    this.stateListeners.add(listener)
  }

  protected override onTransition(state: OtpInputState) {
    this.stateListeners.forEach(listener => listener(state))
  }

  render = () => {
    const api = this.api

    if (this.rootNode)
      spreadProps(this.rootNode, api.getRootProps())

    if (this.labelEl)
      spreadProps(this.labelEl, api.getLabelProps())

    if (this.controlEl)
      spreadProps(this.controlEl, api.getControlProps())

    this.inputEls.forEach((input, index) => {
      spreadProps(input, {
        ...api.getInputProps({ index }),
        'data-testid': `input-${index + 1}`,
      })
    })

    if (this.hiddenInput)
      spreadProps(this.hiddenInput, api.getHiddenInputProps())
  }
}

export function render(target: HTMLElement) {
  const controls = useControls(otpInputControls)
  const layout = Layout()
  target.innerHTML = ''
  target.appendChild(layout.root)

  const inputsMarkup = Array.from({ length: INPUT_LENGTH }, (_item, index) => `
          <input data-testid="input-${index + 1}" data-otp-input />
        `).join('')

  layout.main.innerHTML = `
    <main data-otp-example>
      <div data-otp-root>
        <label data-otp-label>Enter code:</label>
        <div data-otp-control>
${inputsMarkup}
        </div>
        <input data-otp-hidden />
      </div>
      <button type="button" data-testid="clear-button" data-otp-clear>
        Clear
      </button>
    </main>
  `

  const scope = layout.main.querySelector<HTMLElement>('[data-otp-example]')
  if (!scope)
    return

  const toolbar = Toolbar()
  toolbar.setControlsSlot(() => ControlsPanel(controls))
  layout.root.appendChild(toolbar.root)

  const instance = new OtpInputExample(scope, {
    id: 'otp-input:vanilla',
    name: 'otp',
    value: Array.from({ length: INPUT_LENGTH }, () => ''),
  }, {
    context: {
      get: () => controls.context as Partial<OtpInputMachineContext>,
      subscribe: (fn: (ctx: Partial<OtpInputMachineContext>) => void) => controls.subscribe(fn as any),
    },
  })
  instance.init()

  const updateVisualizer = (state?: OtpInputState) => {
    if (!state)
      return
    toolbar.setVisualizerSlot(() => StateVisualizer({ state }))
  }

  updateVisualizer(instance.state as OtpInputState)
  instance.onStateChange(updateVisualizer)
}
