import type { PropertyValues } from 'lit'
import { consume } from '@lit/context'
import { html, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { type CollapsibleContext, collapsibleContext } from './root'
import '@destyler/primitive'

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
    else {
      this.width = 0
      this.height = 0
    }
    super.update(changedProperties)
  }

  override render() {
    const props = {
      style: `--destyler-collapsible-content-width:${this.width}px;--destyler-collapsible-content-height:${this.height}px;${!this._collapsibleState?.open ? 'display:none;' : ''}`,
    }
    return html`<destyler-slot .props="${props}"><slot ></slot></destyler-slot>`
  }
}
