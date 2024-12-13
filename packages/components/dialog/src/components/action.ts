import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dialog-action')
export class AlertDialogAction extends LitElement {
  private _onClick() {
    // Dispatch a custom event for action handling
    const actionEvent = new CustomEvent('dialog-action', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(actionEvent);

    // Close the dialog
    const closeEvent = new CustomEvent('dialog-close', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(closeEvent);
  }

  override render() {
    return html`
      <slot @click="${this._onClick}"></slot>
    `;
  }
}
