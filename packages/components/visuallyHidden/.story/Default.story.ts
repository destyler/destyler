import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';

import '../src';

export default {
  title: 'Utilities/VisuallyHidden',
  component: 'visually-hidden',
} as Meta;

export const Default: StoryObj = {
    render: () => html`
  <style>
    .button {
      font-size: 16px;
      padding: 8px 16px;
    }
  </style>
  <button class="button">
    Accessible Button
    <destyler-visually-hidden> - This text is hidden but accessible to screen readers</destyler-visually-hidden>
  </button>
  <p>
    Inspect the button element or use a screen reader to verify that the hidden text is present
    and accessible.
  </p>
`};

Default.storyName = 'Default';
