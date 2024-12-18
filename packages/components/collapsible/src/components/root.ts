import type { PropertyValues } from 'lit'
import { createContext, provide } from '@lit/context'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export const collapsibleContext = createContext<CollapsibleContext>(
  Symbol('collapsible-context'),
)

export interface CollapsibleContext {
  open: boolean
}

@customElement('collapsible-root')
export class CollapsibleRoot extends LitElement {
  @property({ type: Boolean })
  open = false

  override connectedCallback() {
    super.connectedCallback()
    this.addEventListener('destyler-collapsible-open', this._onOpen)
    this.addEventListener('destyler-collapsible-close', this._onClose)
  }

  override disconnectedCallback() {
    this.removeEventListener('destyler-collapsible-open', this._onOpen)
    this.removeEventListener('destyler-collapsible-close', this._onClose)
    super.disconnectedCallback()
  }

  private _onOpen = () => {
    this.open = true
  }

  private _onClose = () => {
    this.open = false
  }

  protected update(changedProperties: PropertyValues): void {
    super.update(changedProperties)
    this._context = this.provide()
  }

  private provide(): CollapsibleContext {
    return {
      open: this.open,
    }
  }

  @provide({ context: collapsibleContext })
  _context: CollapsibleContext = this.provide()

  override render() {
    return html`<slot></slot>`
  }
}
