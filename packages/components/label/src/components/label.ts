import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('destyler-label')
export class Label extends LitElement {
  private handleMovedown = (e: MouseEvent) => {
    if (!e.defaultPrevented && e.detail > 1)
      e.preventDefault()
  }

  override render() {
    return html`
      <slot @mousedown=${this.handleMovedown}></slot>
    `
  }
}
