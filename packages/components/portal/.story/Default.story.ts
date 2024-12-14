import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { Meta } from '@storybook/web-components';
import { portal } from '../src';
import { signal, SignalWatcher } from '@lit-labs/signals';

const modalVisible = signal(false);

@customElement('modal-example')
class ModalExample extends SignalWatcher(LitElement) {

  static override styles = css`
    .modal {
      position: fixed;
      z-index: 1001;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 16px;
      max-width: 500px;
      width: 90%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .overlay {
      position: fixed;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
    }

    button {
      padding: 8px 16px;
      font-size: 16px;
    }
  `;

  private openModal() {
    modalVisible.set(true);
  }

  private closeModal() {
    modalVisible.set(false);
  }

  override render() {
    return html`
      <button @click=${this.openModal}>Open Modal</button>

      ${modalVisible.get()
        ? portal(
            html`
              <div class="overlay" @click=${this.closeModal}></div>
              <div class="modal">
                <h2>Modal Title</h2>
                <p>This modal is rendered using a portal.</p>
                <button @click=${this.closeModal}>Close Modal</button>
              </div>
            `
          )
        : ''}
    `;
  }
}

export default {
  title: 'Utilities/Portal',
  component: 'portal',
} as Meta;

export const ModalExampleStory = () => html`<modal-example></modal-example>`;
