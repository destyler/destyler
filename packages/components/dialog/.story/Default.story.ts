import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src'

export default {
  title: 'Components/Dialog',
  component: 'dialog',
} as Meta;

export const Default = () => html`
  <style>
    /* Styles for the trigger button */
    .trigger-button {
      display: inline-flex;
      height: 35px;
      align-items: center;
      justify-content: center;
      padding: 0 15px;
      font-weight: 500;
      background-color: white;
      color: #7c3aed; /* violet11 */
      border: none;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .trigger-button:hover {
      background-color: #f5f3ff; /* mauve3 */
    }

    /* Styles for the overlay */
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
    }

    /* Styles for the dialog content */
    .content {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-height: 85vh;
      width: 90vw;
      max-width: 500px;
      background: white;
      padding: 25px;
      border-radius: 8px;
      box-shadow: 0 10px 38px -10px rgba(0, 0, 0, 0.35),
        0 10px 20px -15px rgba(0, 0, 0, 0.2);
      outline: none;
    }

    /* Styles for the title */
    .title {
      margin: 0;
      font-size: 17px;
      font-weight: 500;
      color: #1a1523; /* Adjust as needed */
    }

    /* Styles for the description */
    .description {
      margin-top: 15px;
      margin-bottom: 20px;
      font-size: 15px;
      line-height: normal;
      color: #6e6d7a; /* Adjust as needed */
    }

    /* Styles for the dialog buttons */
    .dialog-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 25px;
    }

    .cancel-button,
    .action-button {
      display: inline-flex;
      height: 35px;
      align-items: center;
      justify-content: center;
      padding: 0 15px;
      font-weight: 500;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }

    .cancel-button {
      background-color: #e0e0e0; /* mauve4 */
      color: #57534e; /* mauve11 */
    }

    .cancel-button:hover {
      background-color: #d6d3d1; /* mauve5 */
    }

    .action-button {
      background-color: #f87171; /* red4 */
      color: #991b1b; /* red11 */
    }

    .action-button:hover {
      background-color: #ef4444; /* red5 */
    }
  </style>

  <dialog-root>
    <dialog-trigger>
      <button class="trigger-button">
        Delete account
      </button>
    </dialog-trigger>
    <dialog-portal>
      <dialog-overlay><div class="overlay"></div></dialog-overlay>
      <dialog-content class="content">
        <dialog-title>
          <h2 class="title">Are you absolutely sure?</h2>
        </dialog-title>
        <dialog-description>
          <p class="description">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
          </p>
        </dialog-description>
        <div class="dialog-buttons">
          <dialog-cancel>
            <button class="cancel-button">
              Cancel
            </button>
          </dialog-cancel>
          <dialog-action @click="${() => console.log('Confirmed')}">
            <button class="action-button">
              Yes, delete account
            </button>
          </dialog-action>
        </div>
      </dialog-content>
    </dialog-portal>
  </dialog-root>
`;

Default.storyName = 'Default';
