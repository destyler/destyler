import type { ContextFrom } from '@destyler/lit'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { paginationControls } from '@destyler/shared-private'
import { ControlsController } from '@destyler/shared-private/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as pagination from '../../index'
import styles from '../style.css?inline'

type PaginationMachineContext = ContextFrom<typeof pagination.machine>

@customElement('destyler-pagination')
export class PaginationElement extends LitElement {
  private controls = new ControlsController(paginationControls)

  private machine = new MachineController(
    this,
    pagination.machine({
      id: 'pagination:lit',
      count: 1000,
    }),
    {
      context: {
        get: () => this.controls.context as Partial<PaginationMachineContext>,
        subscribe: (fn: (ctx: Partial<PaginationMachineContext>) => void) =>
          this.controls.subscribe(fn as any),
      },
    },
  )

  render() {
    const api = pagination.connect(this.machine.state, this.machine.send, normalizeProps)

    return html`
      <destyler-layout>
        <main>
          <nav ${spread(api.getRootProps())}>
            <ul style="display: flex;">
              <li>
                <a ${spread(api.getPrevTriggerProps())}>⬅️</a>
              </li>
              ${api.pages.map((page, index) => html`
                <li>
                  ${page.type === 'page'
                    ? html`<a ${spread(api.getItemProps(page))}>${page.value}</a>`
                    : html`<span ${spread(api.getEllipsisProps({ index }))}>&#8230;</span>`}
                </li>
              `)}
              <li>
                <a ${spread(api.getNextTriggerProps())}>➡️</a>
              </li>
            </ul>
          </nav>
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
    'destyler-pagination': PaginationElement
  }
}
