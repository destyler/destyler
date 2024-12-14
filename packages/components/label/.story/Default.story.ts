import { html } from 'lit';
import { Meta } from '@storybook/web-components';
import '../src'

export default {
  title: 'Components/Label',
  component: 'label',
} as Meta;

export const Default = () => html`
  <destyler-label>
    <label>Label for name</label>
  </destyler-label>
`;

Default.storyName = 'Default';
