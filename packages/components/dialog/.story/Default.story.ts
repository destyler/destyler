import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src'

export default {
  title: 'Components/Dialog',
  component: 'dialog',
} as Meta;

export const Default = () => html`
  <style>
    @unocss-placeholder
  </style>

  <dialog-root>
    <dialog-trigger>
      <button
        class="
        inline-flex h-[35px] items-center justify-center font-medium
        bg-[white] text-violet-600 rounded cursor-pointer hover:bg-violet-50
        shadow-[0_2px_10px_rgba(0,0,0,0.1)] px-[15px] py-0 border-[none]
        "
      >
        Delete account
      </button>
    </dialog-trigger>
    <dialog-portal>
      <dialog-overlay>
        <div class="fixed inset-0 [background:rgba(0,0,0,0.6)]"></div>
      </dialog-overlay>
      <dialog-content
        class="
        fixed -translate-x-2/4 -translate-y-2/4 max-h-[85vh] w-[90vw] max-w-[500px]
        shadow-[0_10px_38px_-10px_rgba(0,0,0,0.35),0_10px_20px_-15px_rgba(0,0,0,0.2)]
        p-[25px] rounded-lg left-2/4 top-2/4 bg-white [outline:none]
        "
      >
        <dialog-title>
          <h2 class="text-[17px] font-medium text-[#1a1523] m-0">Are you absolutely sure?</h2>
        </dialog-title>
        <dialog-description>
          <p class="text-[15px] leading-[normal] text-[#6e6d7a] mt-[15px] mb-5">
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
          </p>
        </dialog-description>
        <div class="flex justify-end gap-[25px]">
          <dialog-cancel>
            <button
              class="
              inline-flex h-[35px] items-center justify-center font-medium
              rounded cursor-pointer px-[15px] py-0 border-[none]
              bg-[#e0e0e0] text-stone-600 hover:bg-stone-300
              "
            >
              Cancel
            </button>
          </dialog-cancel>
          <dialog-action @click="${() => console.log('Confirmed')}">
            <button
              class="
              inline-flex h-[35px] items-center justify-center font-medium
              rounded cursor-pointer px-[15px] py-0 border-[none]
              bg-red-400 text-red-800 hover:bg-red-500
              "
            >
              Yes, delete account
            </button>
          </dialog-action>
        </div>
      </dialog-content>
    </dialog-portal>
  </dialog-root>
`;

Default.storyName = 'Default';
