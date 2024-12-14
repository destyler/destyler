import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dialog-title')
export class DialogTitle extends LitElement {
  override render() {
    return html`
      <slot></slot>
    `;
  }
}
