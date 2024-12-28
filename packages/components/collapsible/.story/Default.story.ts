import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src'

function UnoTemplate(){
  return html`
  <style>
    .content {
      max-width: 700px;
      padding-top: 10px;
      padding-bottom: 10px;
      margin-top: 5px;
      margin-bottom: 5px;
    }
    @unocss-placeholder
  </style>
  `
}

export default {
  title: 'Components/Collapsible',
  component: 'collapsible',
} as Meta;

export const Unstyle = () => html`
  ${UnoTemplate()}
  <collapsible-root>
    <collapsible-trigger>
      <button class="cursor-pointer text-49px">
        open
      </button>
    </collapsible-trigger>
    <collapsible-content>
      <p class="content text-48px">wao</p>
    </collapsible-content>
  </collapsible-root>
`;

Unstyle.storyName = 'Unstyle';
