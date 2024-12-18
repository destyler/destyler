import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('dialog-trigger')
export class DialogTrigger extends LitElement {
  private _onClick() {
    const event = new CustomEvent('destyler-dialog-open', {
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
