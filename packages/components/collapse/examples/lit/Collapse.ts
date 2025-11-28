import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { collapseControls, collapseData } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as collapse from '../../index'
import styles from '../style.css?inline'

type CollapseMachineContext = ContextFrom<typeof collapse.machine>

@customElement('destyler-collapse')
export class CollapseElement extends LitElement {
  private controls = new ControlsController(collapseControls)

  private machine = new MachineController(
    this,
    collapse.machine({
      id: '1',
    }),
    {
      context: {
        get: () => this.controls.context as Partial<CollapseMachineContext>,
        subscribe: (fn: (ctx: Partial<CollapseMachineContext>) => void) => this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = collapse.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
    <destyler-layout>
      <div ${spread(api.getRootProps())}>
        ${collapseData.map(item => html`
          <div ${spread(api.getItemProps({ value: item.id }))}>
            <h3>
              <button ${spread(api.getItemTriggerProps({ value: item.id }))}>
                ${item.title}
                <div ${spread(api.getItemIndicatorProps({ value: item.id }))}>
                  &gt;
                </div>
              </button>
            </h3>
            <div ${spread(api.getItemContentProps({ value: item.id }))}>
              ${item.content}
            </div>
          </div>
        `)}
      </div>
      <destyler-toolbar .controls=${this.controls} accesskey="0">
        <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
      </destyler-toolbar>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-collapse': CollapseElement
  }
}
