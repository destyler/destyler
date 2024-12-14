import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {createContext, provide} from '@lit/context'

export const dialogContext = createContext<DialogContext>(
  Symbol("dialog-context"),
);

export type DialogContext = {
  open: boolean
}

@customElement('dialog-root')
export class AlertDialogRoot extends LitElement {
  @property({ type: Boolean })
  open = false;

  @provide({ context: dialogContext })
  @property()
  _context: DialogContext = {
    open: this.open
  };

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('dialog-open', this._onOpen);
    this.addEventListener('dialog-close', this._onClose);
  }

  override disconnectedCallback() {
    this.removeEventListener('dialog-open', this._onOpen);
    this.removeEventListener('dialog-close', this._onClose);
    super.disconnectedCallback();
  }

  private _onOpen = () => {
    this.open = true;
    this._context = {
      open: this.open
    }
  };

  private _onClose = () => {
    this.open = false;
    this._context = {
      open: this.open
    }
  };

  override render() {
    return html`<slot></slot>`;
  }
}
