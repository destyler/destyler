import { css, html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('destyler-layout')
export class DestylerLayout extends LitElement {
  static styles = css`
    .layout{
      flex: 1 1 0%;
      padding: 1.5rem; /* 24px */
      overflow-y: auto;
    }
  `
  protected render() {
    return html`
      <div class="layout">
        <slot></slot>
      </div>
    `
  }
}
