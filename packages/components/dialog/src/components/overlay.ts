import { LitElement, html,nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import {consume} from '@lit/context'
import {dialogContext, type DialogContext} from './root'

@customElement('dialog-overlay')
export class AlertDialogOverlay extends LitElement {

  @consume({ context: dialogContext, subscribe: true })
  _dialogState?: DialogContext;

  private _onClick() {
    const event = new CustomEvent('dialog-close', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  override render() {
    return html`
      ${this._dialogState?.open ? html`<slot @click="${this._onClick}"></slot>` : nothing}
    `;
  }
}
