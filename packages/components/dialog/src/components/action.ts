import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('dialog-action')
export class DialogAction extends LitElement {
  private _onClick() {
    // Close the dialog
    const closeEvent = new CustomEvent('destyler-dialog-close', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(closeEvent)
  }

  override render() {
    return html`
      <slot @click="${this._onClick}"></slot>
    `
  }
}
