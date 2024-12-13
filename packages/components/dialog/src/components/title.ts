import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dialog-title')
export class AlertDialogTitle extends LitElement {
  override render() {
    return html`
      <slot></slot>
    `;
  }
}
