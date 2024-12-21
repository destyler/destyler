import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@destyler/primitive'

@customElement('dialog-cancel')
export class DialogCancel extends LitElement {
  private _onClick() {
    const event = new CustomEvent('destyler-dialog-close', {
      bubbles: true,
      composed: true,
    })
    this.dispatchEvent(event)
  }

  override render() {
    const events = {
      click: this._onClick,
    }

    const props = {
      role: 'dialog-cancel',
    }

    return html`
      <destyler-slot .props="${props}" .events="${events}">
        <slot></slot>
      </destyler-slot>
    `
  }
}
