<Props
  :value="[
    {
      name: 'asChild',
      type: 'boolean',
      default: 'false',
      description: 'Change the default rendered element for the one passed as a child, merging their props and behavior. <br/><br/>Read our Composition guide for more details.',
    },
    {
      name: 'src',
      type: 'string',
      default: '',
      description: 'image url',
    },
  ]"
/>

<Event
  :value="[
    {
      name: 'loadingStatusChange',
      type: '[_status: ImageLoadingStatus]',
      description:'A callback providing information about the loading status of the image.<br />This is useful in case you want to control more precisely what to render as the image is loading.'
    }
  ]"
/>
