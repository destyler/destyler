import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { otpInputControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as otpInput from '../../index'
import styles from '../style.css?inline'

type OtpInputMachineContext = ContextFrom<typeof otpInput.machine>
const INPUT_LENGTH = 3

@customElement('destyler-otp-input')
export class OtpInputElement extends LitElement {
  private controls = new ControlsController(otpInputControls)

  private machine = new MachineController(
    this,
    otpInput.machine({
      id: 'otp-input:lit',
      name: 'otp',
      value: Array.from({ length: INPUT_LENGTH }, () => ''),
    }),
    {
      context: {
        get: () => this.controls.context as Partial<OtpInputMachineContext>,
        subscribe: (fn: (ctx: Partial<OtpInputMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = otpInput.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div ${spread(api.getRootProps())}>
            <label ${spread(api.getLabelProps())}>Enter code:</label>
            <div ${spread(api.getControlProps())}>
              ${Array.from({ length: INPUT_LENGTH }, (_item, index) => html`
                <input data-testid=${`input-${index + 1}`} ${spread(api.getInputProps({ index }))} />
              `)}
            </div>
            <input ${spread(api.getHiddenInputProps())} />
          </div>
          <button data-testid="clear-button" @click=${() => api.clearValue()}>
            Clear
          </button>
        </main>
        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-otp-input': OtpInputElement
  }
}
