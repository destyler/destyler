import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dialog-overlay')
export class AlertDialogOverlay extends LitElement {
  private _onClick() {
    const event = new CustomEvent('dialog-close', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  override render() {
    return html`
      <slot @click="${this._onClick}"></slot>
    `;
  }
}
