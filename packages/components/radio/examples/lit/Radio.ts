import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { radioControls, radioData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as radio from '../../index'
import styles from '../style.css?inline'
import '../style.css'

type RadioMachineContext = ContextFrom<typeof radio.machine>

@customElement('destyler-radio')
export class RadioElement extends LitElement {
  private controls = new ControlsController(radioControls)

  private machine = new MachineController(
    this,
    radio.machine({
      id: 'radio:lit',
      name: 'fruits',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<RadioMachineContext>,
        subscribe: (fn: (ctx: Partial<RadioMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = radio.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="radio" style="max-width: 500px;min-width: 500px;">
          <fieldset ?disabled=${this.machine.state.context.fieldsetDisabled ?? false}>
            <div ${spread(api.getRootProps())}>
              <h3 ${spread(api.getLabelProps())}>
                Fruits
              </h3>
              <div ${spread(api.getIndicatorProps())}></div>
              ${radioData.map(item => html`
                <label data-testid=${`radio-${item.id}`} ${spread(api.getItemProps({ value: item.id }))}>
                  <div data-testid=${`control-${item.id}`} ${spread(api.getItemControlProps({ value: item.id }))}></div>
                  <span data-testid=${`label-${item.id}`} ${spread(api.getItemTextProps({ value: item.id }))}>
                    ${item.label}
                  </span>
                  <input data-testid=${`input-${item.id}`} ${spread(api.getItemHiddenInputProps({ value: item.id }))} />
                </label>
              `)}
            </div>

            <button type="reset">Reset</button>
            <button type="button" @click=${() => api.clearValue()}>
              Clear
            </button>
            <button type="button" @click=${() => api.setValue('mango')}>
              Set to Mangoes
            </button>
            <button type="button" @click=${() => api.focus()}>
              Focus
            </button>
          </fieldset>
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
    'destyler-radio': RadioElement
  }
}
