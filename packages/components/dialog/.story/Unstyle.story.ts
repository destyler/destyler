import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src'

export default {
  title: 'Components/Dialog',
  component: 'dialog',
} as Meta;

export const Unstyle = () => html`
  <dialog-root>
    <dialog-trigger>
      <button>
        Delete account
      </button>
    </dialog-trigger>
    <dialog-portal>
      <dialog-overlay></dialog-overlay>
      <dialog-content>
          <dialog-title>
            <h2>Are you absolutely sure?</h2>
          </dialog-title>
          <dialog-description>
            <p>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
            </p>
          </dialog-description>
          <div>
            <dialog-cancel>
              <button>
                Cancel
              </button>
            </dialog-cancel>
            <dialog-action @click="${() => console.log('Confirmed')}">
              <button>
                Yes, delete account
              </button>
            </dialog-action>
          </div>
      </dialog-content>
    </dialog-portal>

  </dialog-root>
`;

Unstyle.storyName = 'Unstyle';
