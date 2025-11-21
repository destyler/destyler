import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { selectControls, selectData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as select from '../../index'
import styles from '../style.css?inline'

type SelectMachineContext = ContextFrom<typeof select.machine>

function createCollection() {
  return select.collection({ items: selectData })
}

@customElement('destyler-select')
export class SelectElement extends LitElement {
  private controls = new ControlsController(selectControls)
  private collection = createCollection()

  private machine = new MachineController(
    this,
    select.machine({
      id: 'select:lit',
      name: 'country',
      collection: this.collection,
    }),
    {
      context: {
        get: () => ({
          ...(this.controls.context as Partial<SelectMachineContext>),
          collection: this.collection,
        }),
        subscribe: (fn: (ctx: Partial<SelectMachineContext>) => void) =>
          this.controls.subscribe((ctx) => {
            fn({
              ...ctx,
              collection: this.collection,
            })
          }),
      },
    },
  )

  render() {
    const api = select.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main class="select">
          <div ${spread(api.getRootProps())}>
            <label ${spread(api.getLabelProps())}>Label</label>
            <div ${spread(api.getControlProps())}>
              <button ${spread(api.getTriggerProps())}>
                <span ${spread(api.getValueTextProps())}>${api.valueAsString || 'Select option'}</span>
                <span aria-hidden="true" ${spread(api.getIndicatorProps())}>▼</span>
              </button>
              <button ${spread(api.getClearTriggerProps())}>X</button>
            </div>
            <form>
              <select ${spread(api.getHiddenSelectProps())}>
                ${api.empty ? html`<option value=""></option>` : null}
                ${selectData.map(item => html`<option value=${item.value}>${item.label}</option>`)}
              </select>
            </form>
          </div>

          <div ${spread(api.getPositionerProps())}>
            <ul ${spread(api.getContentProps())}>
              ${selectData.map(item => html`
                <li data-testid=${`item-${item.label}`} ${spread(api.getItemProps({ item }))}>
                  <span ${spread(api.getItemTextProps({ item }))}>${item.label}</span>
                  <span ${spread(api.getItemIndicatorProps({ item }))}>✓</span>
                </li>
              `)}
            </ul>
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
    'destyler-select': SelectElement
  }
}
