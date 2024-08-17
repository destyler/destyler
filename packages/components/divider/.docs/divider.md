<Props
  :value="[
    {
      name: 'as',
      type: 'AsTag | Component',
      default: 'div',
      description: 'The element or component this component should render as. <br/>Can be overwrite by <code>asChild</code>',
    },
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
    {
      name: 'orientation',
      type: 'DataOrientation',
      default: 'horizontal',
      description: 'Orientation of the component.<br/>Either <code>vertical</code> or <code>horizontal</code>. Defaults to <code>horizontal</code>.',
    },
    {
      name: 'decorative',
      type: 'boolean',
      default: '-',
      description: 'Whether or not the component is purely decorative.<br />When <code>true</code>, accessibility-related attributes are updated so that that the rendered element is removed from the accessibility tree.',
    },
  ]"
/>

<Attribute
  :value="[
    {
      name: '[data-orientation]',
      value:`\'vertical\' | \'horizontal\'`
    },
  ]"
/>
