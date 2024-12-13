import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dialog-content')
export class AlertDialogContent extends LitElement {

  override render() {
    return html`
      <slot></slot>
    `;
  }
}
