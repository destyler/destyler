import type { PropertyValues } from 'lit'
import { createContext, provide } from '@lit/context'
import { html, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export const dialogContext = createContext<DialogContext>(
  Symbol('dialog-context'),
)

export interface DialogContext {
  open: boolean
}

@customElement('dialog-root')
export class DialogRoot extends LitElement {
  @property({ type: Boolean })
  open = false

  override connectedCallback() {
    super.connectedCallback()
    this.addEventListener('destyler-dialog-open', this._onOpen)
    this.addEventListener('destyler-dialog-close', this._onClose)
  }

  override disconnectedCallback() {
    this.removeEventListener('destyler-dialog-open', this._onOpen)
    this.removeEventListener('destyler-dialog-close', this._onClose)
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

  private provide(): DialogContext {
    return {
      open: this.open,
    }
  }

  @provide({ context: dialogContext })
  _context: DialogContext = this.provide()

  override render() {
    return html`<slot></slot>`
  }
}
