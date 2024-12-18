import type { PropertyValues } from 'lit'
import { consume } from '@lit/context'
import { html, LitElement, nothing } from 'lit'
import { customElement } from 'lit/decorators.js'
import { type CollapsibleContext, collapsibleContext } from './root'

@customElement('collapsible-content')
export class CollapsibleContent extends LitElement {
  @consume({ context: collapsibleContext, subscribe: true })
  _collapsibleState?: CollapsibleContext

  private width: number = 0
  private height: number = 0

  protected update(changedProperties: PropertyValues): void {
    if (this._collapsibleState?.open) {
      const rect = this.getBoundingClientRect()
      this.width = rect.width
      this.height = rect.height
    }
    super.update(changedProperties)
  }

  override render() {
    return html`
      ${this._collapsibleState?.open
        ? html`<slot style="--destyler-collapsible-content-width:${this.width}px;--destyler-collapsible-content-height:${this.height}px;"></slot>`
        : nothing}
    `
  }
}
