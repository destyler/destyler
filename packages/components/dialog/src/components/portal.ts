import { LitElement, html,nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import {consume} from '@lit/context'
import {dialogContext, type DialogContext} from './root'

@customElement('dialog-portal')
export class DialogPortal extends LitElement {

  @consume({ context: dialogContext, subscribe: true })
  _dialogState?: DialogContext;

  override render() {
    return html`
      ${this._dialogState?.open ? html`<slot></slot>` : nothing}
    `;
  }
}
