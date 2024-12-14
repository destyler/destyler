import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('dialog-description')
export class DialogDescription extends LitElement {

  override render() {
    return html`
      <slot></slot>
    `;
  }
}
