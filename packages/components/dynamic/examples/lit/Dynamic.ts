import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { dynamicControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as dynamic from '../../index'
import styles from '../style.css?inline'

type DynamicMachineContext = ContextFrom<typeof dynamic.machine>

function toDashCase(value: string) {
  return value.replace(/\s+/g, '-').toLowerCase()
}

@customElement('destyler-dynamic')
export class DynamicElement extends LitElement {
  private controls = new ControlsController(dynamicControls)

  private machine = new MachineController(
    this,
    dynamic.machine({
      id: 'dynamic:lit',
      value: ['React', 'Vue'],
    }),
    {
      context: {
        get: () => this.controls.context as Partial<DynamicMachineContext>,
        subscribe: (fn: (ctx: Partial<DynamicMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = dynamic.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <input data-testid="copy-text" style="margin-bottom: 1rem;" />
          <div ${spread(api.getRootProps())}>
            <div>
              ${api.value.map((value, index) => html`
                <span
                  style="position: relative;"
                  ${spread(api.getItemProps({ index, value }))}
                >
                  <div
                    data-testid="${toDashCase(value)}-input"
                    ${spread(api.getItemPreviewProps({ index, value }))}
                  >
                    <span>${value}</span>
                    <button
                      data-testid="${toDashCase(value)}-delete-trigger"
                      ${spread(api.getItemDeleteTriggerProps({ index, value }))}
                    >
                      &#x2715;
                    </button>
                  </div>
                  <input
                    data-testid="${toDashCase(value)}-item-input"
                    ${spread(api.getItemInputProps({ index, value }))}
                  />
                </span>
              `)}
            </div>
            <input
              placeholder="Add tag..."
              ${spread(api.getInputProps())}
            />
          </div>
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
    'destyler-dynamic': DynamicElement
  }
}
