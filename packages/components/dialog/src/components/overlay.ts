import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dialog-overlay')
export class AlertDialogOverlay extends LitElement {

  override render() {
    return html`
      <slot></slot>
    `;
  }
}
