import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src'

export default {
  title: 'Components/Collapsible',
  component: 'collapsible',
} as Meta;

export const Unstyle = () => html`
  <style>
    .content {
      height: var(--destyler-collapsible-content-height);
    }
  </style>
  <collapsible-root>
    <collapsible-trigger>
      <button>
        open
      </button>
    </collapsible-trigger>
    <collapsible-content>
      <p class="content">wao</p>
    </collapsible-content>
  </collapsible-root>
`;

Unstyle.storyName = 'Unstyle';
