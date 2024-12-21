import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@destyler/primitive'

@customElement('destyler-label')
export class Label extends LitElement {
  private handleMovedown = (e: MouseEvent) => {
    if (!e.defaultPrevented && e.detail > 1)
      e.preventDefault()
  }

  override render() {
    const props = {
      role: 'label',
    }
    const events = {
      mousedown: this.handleMovedown,
    }
    return html`
      <destyler-slot .props="${props}" .events="${events}"><slot></slot></destyler-slot>
    `
  }
}
