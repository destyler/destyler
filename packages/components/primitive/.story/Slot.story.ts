import { html } from 'lit';
import { Meta, StoryObj } from '@storybook/web-components';

import '../src';

export default {
  title: 'Utilities/Slot',
  component: 'destyler-slot',
} as Meta;

interface SlotComponentArgs {
  props: { [key: string]: any };
  events: { [key: string]: EventListener };
}

const Template: StoryObj<SlotComponentArgs> = {
    render: ({ props, events }) => html`
  <destyler-slot .props="${props}" .events="${events}">
    <button>Click Me</button>
  </destyler-slot>
`};

export const Default = Template;

Default.args = {
  props: { 'aria-label': 'Accessible Button' },
  events: {
    click: () => alert('Button clicked!'),
  },
};
Default.storyName = 'Default';

export const CustomPropsAndEvents = {...Template};
CustomPropsAndEvents.args = {
  props: { 'aria-label': 'Custom Button', disabled: true },
  events: {
    click: () => alert('This button is disabled'),
  },
};
CustomPropsAndEvents.storyName = 'Custom Props and Events';



export const SlottedInput = {...Template};
SlottedInput.args = {
  props: { placeholder: 'Enter text here' },
  events: {
    input: (e: Event) => console.log((e.target as HTMLInputElement).value),
  },
};
SlottedInput.storyName = 'Slotted Input Element';
SlottedInput.render = ({ props, events }) => html`
  <destyler-slot .props="${props}" .events="${events}">
    <input type="text" />
  </destyler-slot>
`;
