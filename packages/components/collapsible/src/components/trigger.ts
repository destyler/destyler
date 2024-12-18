import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('collapsible-trigger')
export class CollapsibleTrigger extends LitElement {
  private _onClick() {
    const event = new CustomEvent('destyler-collapsible-toggle', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  override render() {
    return html`
      <slot @click="${this._onClick}"></slot>
    `
  }
}
