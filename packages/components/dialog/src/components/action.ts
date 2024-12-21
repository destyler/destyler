import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@destyler/primitive'

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
    const events = {
      click: this._onClick,
    }

    return html`
      <destyler-slot .events="${events}">
        <slot></slot>
      </destyler-slot>
    `
  }
}
