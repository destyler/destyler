import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { numberInputControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as numberInput from '../../index'
import styles from '../style.css?inline'

type NumberInputMachineContext = ContextFrom<typeof numberInput.machine>

@customElement('destyler-number-input')
export class NumberInputElement extends LitElement {
  private controls = new ControlsController(numberInputControls)

  private machine = new MachineController(
    this,
    numberInput.machine({
      id: 'number-input:lit',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<NumberInputMachineContext>,
        subscribe: (fn: (ctx: Partial<NumberInputMachineContext>) => void) =>
          this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = numberInput.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <div ${spread(api.getRootProps())}>
            <div data-testid="scrubber" ${spread(api.getScrubberProps())}></div>
            <label data-testid="label" ${spread(api.getLabelProps())}>
              Enter number:
            </label>
            <div ${spread(api.getControlProps())}>
              <button data-testid="dec-button" ${spread(api.getDecrementTriggerProps())}>DEC</button>
              <input data-testid="input" ${spread(api.getInputProps())} />
              <button data-testid="inc-button" ${spread(api.getIncrementTriggerProps())}>INC</button>
            </div>
          </div>
        </main>

        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer
            .state=${this.machine.state}
            .omit=${['formatter', 'parser']}
          ></destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-number-input': NumberInputElement
  }
}
