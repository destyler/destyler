import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('dialog-overlay')
export class DialogOverlay extends LitElement {
  private _onClick() {
    const event = new CustomEvent('destyler-dialog-close', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  override render() {
    return html`<slot @click="${this._onClick}"></slot>`
  }
}
