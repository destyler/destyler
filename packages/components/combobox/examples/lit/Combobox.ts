import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { comboboxControls, listData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as combobox from '../../index'
import styles from '../style.css?inline'

type ComboboxMachineContext = ContextFrom<typeof combobox.machine>
type Country = (typeof listData)[number]

function createCollection() {
  return combobox.collection({
    items: listData,
    itemToValue: item => item.code,
    itemToString: item => item.label,
  })
}

@customElement('destyler-combobox')
export class ComboboxElement extends LitElement {
  private controls = new ControlsController(comboboxControls)
  private collection = createCollection()
  private options: Country[] = [...listData]

  private machine = new MachineController(
    this,
    combobox.machine({
      id: 'combobox:lit',
      collection: this.collection,
      onOpenChange: () => this.resetOptions(),
      onInputValueChange: ({ inputValue }) => this.filterOptions(inputValue),
    }),
    {
      context: {
        get: () => ({
          ...(this.controls.context as Partial<ComboboxMachineContext>),
          collection: this.collection,
        }),
        subscribe: (fn: (ctx: Partial<ComboboxMachineContext>) => void) =>
          this.controls.subscribe((ctx) => {
            fn({
              ...ctx,
              collection: this.collection,
            })
          }),
      },
    },
  )

  private resetOptions() {
    this.setOptions(listData)
  }

  private filterOptions(inputValue: string) {
    const filtered = listData.filter(item =>
      item.label.toLowerCase().includes(inputValue.toLowerCase()),
    )
    this.setOptions(filtered.length > 0 ? filtered : listData)
  }

  private setOptions(next: Country[]) {
    this.options = [...next]
    this.collection.setItems(this.options)
    this.requestUpdate()
  }

  render() {
    const api = combobox.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="combobox">
          <div>
            <button type="button" @click=${() => api.setValue(['TG'])}>Set to Togo</button>
            <button type="button" data-testid="clear-value-button" @click=${() => api.clearValue()}>
              Clear Value
            </button>
            <button type="button" ${spread(api.getClearTriggerProps())}>
              Clear Trigger
            </button>
            <br />
            <div ${spread(api.getRootProps())}>
              <label ${spread(api.getLabelProps())}>Select country</label>
              <div ${spread(api.getControlProps())}>
                <input data-testid="input" ${spread(api.getInputProps())} />
                <button type="button" data-testid="trigger" ${spread(api.getTriggerProps())}>▼</button>
                <button type="button" ${spread(api.getClearTriggerProps())}>x</button>
              </div>
            </div>
            <div ${spread(api.getPositionerProps())}>
              ${this.options.length > 0
                ? html`
                    <ul data-testid="combobox-content" ${spread(api.getContentProps())}>
                      ${this.options.map(item => html`
                        <li data-testid=${item.code} ${spread(api.getItemProps({ item }))}>
                          <span ${spread(api.getItemIndicatorProps({ item }))}>✅</span>
                          <span>${item.label}</span>
                        </li>
                      `)}
                    </ul>
                  `
                : null}
            </div>
          </div>
        </main>
        <destyler-toolbar .controls=${this.controls}>
          <destyler-state-visualizer .state=${this.machine.state} .omit=${['collection']}>
          </destyler-state-visualizer>
        </destyler-toolbar>
      </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-combobox': ComboboxElement
  }
}
