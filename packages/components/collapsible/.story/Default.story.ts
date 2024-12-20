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
      max-width: 700px;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  </style>
  <collapsible-root>
    <collapsible-trigger>
      <button class="cursor-pointer">
        open
      </button>
    </collapsible-trigger>
    <collapsible-content>
      <p class="content">wao</p>
    </collapsible-content>
  </collapsible-root>
`;

Unstyle.storyName = 'Unstyle';
