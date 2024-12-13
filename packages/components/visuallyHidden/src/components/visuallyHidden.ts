import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('destyler-visually-hidden')
export class VisuallyHidden extends LitElement {
  static override styles = css`
    .visually-hidden {
      position: absolute !important;
      border: 0 !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0 0 0 0) !important;
      clip-path: inset(100%) !important;
      white-space: nowrap !important;
    }
  `;

  override render() {
    return html`<span class="visually-hidden"><slot></slot></span>`;
  }
}
