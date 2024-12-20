import { consume } from '@lit/context'
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { type CollapsibleContext, collapsibleContext } from './root'
import '@destyler/primitive'

@customElement('collapsible-trigger')
export class CollapsibleTrigger extends LitElement {
  @consume({ context: collapsibleContext, subscribe: true })
  _collapsibleState?: CollapsibleContext

  private _onClick() {
    const event = new CustomEvent('destyler-collapsible-toggle', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  override render() {
    const event = {
      click: this._onClick,
    }
    const props = {
      'data-state': this._collapsibleState?.open ? 'open' : 'close',
    }
    return html`
      <destyler-slot .props="${props}" .events="${event}">
        <slot></slot>
      </destyler-slot>
    `
  }
}
