import type { BreadcrumbItem } from '../../index'
import { MachineController, normalizeProps, spread } from '@destyler/lit'
import { html, LitElement, unsafeCSS } from 'lit'
import { customElement } from 'lit/decorators.js'
import * as breadcrumbs from '../../index'
import styles from '../style.css?inline'
import '@destyler/shared-private/lit'

@customElement('destyler-breadcrumbs')
export class BreadcrumbsElement extends LitElement {
  private readonly items: BreadcrumbItem[] = [
    { id: '1', label: 'one', href: '/' },
    { id: '2', label: 'two', href: '/products' },
    { id: '3', label: 'three' },
  ]

  private machine = new MachineController(
    this,
    breadcrumbs.machine({
      id: 'breadcrumbs:lit',
      items: this.items,
    }),
  )

  render() {
    const api = breadcrumbs.connect(this.machine.state, this.machine.send, normalizeProps)
    return html`
    <destyler-layout>
      <nav ${spread(api.getRootProps())}>
        <ol ${spread(api.getListProps())}>
          ${api.items.map(
            item => html`
            <li ${spread(api.getItemProps(item))}>
              <a ${spread(api.getLinkProps(item))}>
                ${item.label}
              </a>
              ${item.href ? html`<span ${spread(api.getSeparatorProps())}>/</span>` : null}
            </li>
          `,
          )}
        </ol>
      </nav>
      <destyler-toolbar>
        <destyler-state-visualizer .state=${this.machine.state}></destyler-state-visualizer>
      </destyler-toolbar>
    </destyler-layout>
    `
  }

  static styles = unsafeCSS(styles)
}

declare global {
  interface HTMLElementTagNameMap {
    'destyler-breadcrumbs': BreadcrumbsElement
  }
}
