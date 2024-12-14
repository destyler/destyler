import type { PropertyValues } from 'lit'
import { html, LitElement } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'

@customElement('destyler-slot')
export class SlotComponent extends LitElement {
  @property({ type: Object })
  props: { [key: string]: any } = {}

  @property({ type: Object })
  events: { [key: string]: EventListener } = {}

  @queryAssignedElements({ flatten: true })
  private assignedElements!: HTMLElement[]

  override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('props')) {
      this.applyProps()
    }
    if (changedProperties.has('events')) {
      this.applyEvents()
    }
  }

  private applyProps() {
    this.assignedElements.forEach((el) => {
      Object.entries(this.props).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          el.setAttribute(key, String(value))
        }
        else {
          el.removeAttribute(key)
        }
      })
    })
  }

  private applyEvents() {
    this.assignedElements.forEach((el) => {
      Object.entries(this.events).forEach(([eventName, listener]) => {
        // Remove previous listeners if necessary
        el.removeEventListener(eventName, listener)
        el.addEventListener(eventName, listener)
      })
    })
  }

  override render() {
    return html`<slot></slot>`
  }
}
