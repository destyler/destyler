export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; item(index: number): string; itemGroup: string; nextTrigger: string; prevTrigger: string; indicatorGroup: string; indicator(index: number): string; }>',
    desc: 'The ids of the elements in the carousel. Useful for composition.'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'The localized messages to use.'
  },
  {
    name: 'slidesPerPage',
    type: 'number',
    desc: 'The number of slides to show at a time.'
  },
  {
    name: 'slidesPerMove',
    type: 'number | "auto"',
    desc: 'The number of slides to scroll at a time. When set to `auto`, the number of slides to scroll is determined by the `slidesPerPage` property.'
  },
  {
    name: 'autoplay',
    type: 'boolean | { delay: number; }',
    desc: 'Whether to scroll automatically. The default delay is 4000ms.'
  },
  {
    name: 'allowMouseDrag',
    type: 'boolean',
    desc: 'Whether to allow scrolling via dragging with mouse'
  },
  {
    name: 'loop',
    type: 'boolean',
    desc: 'Whether the carousel should loop around.'
  },
  {
    name: 'page',
    type: 'number',
    desc: 'The index of the active page.'
  },
  {
    name: 'spacing',
    type: 'string',
    desc: 'The amount of space between items.'
  },
  {
    name: 'padding',
    type: 'string',
    desc: 'Defines the extra space added around the scrollable area, enabling nearby items to remain partially in view.'
  },
  {
    name: 'onPageChange',
    type: '(details: PageChangeDetails) => void',
    desc: 'Function called when the page changes.'
  },
  {
    name: 'inViewThreshold',
    type: 'number | number[]',
    desc: 'The threshold for determining if an item is in view.'
  },
  {
    name: 'snapType',
    type: '"proximity" | "mandatory"',
    desc: 'The snap type of the item.'
  },
  {
    name: 'slideCount',
    type: 'number',
    desc: 'The total number of slides. Useful for SSR to render the initial ating the snap points.'
  },
  {
    name: 'onDragStatusChange',
    type: '(details: DragStatusDetails) => void',
    desc: 'Function called when the drag status changes.'
  },
  {
    name: 'onAutoplayStatusChange',
    type: '(details: AutoplayStatusDetails) => void',
    desc: 'Function called when the autoplay status changes.'
  },
  {
    name: 'dir',
    type: '"ltr" | "rtl"',
    desc: 'The document\'s text/writing direction.'
  },
  {
    name: 'id',
    type: 'string',
    desc: 'The unique identifier of the machine.'
  },
  {
    name: 'getRootNode',
    type: '() => ShadowRoot | Node | Document',
    desc: 'A root node to correctly resolve document in custom environments. E.x.: Iframes, Electron.'
  },
  {
    name: 'orientation',
    type: 'Orientation',
    desc: 'The orientation of the element.'
  },
]

export const matchApi = [
  {
    name: 'page',
    type: 'number',
    desc: 'The current index of the carousel'
  },
  {
    name: 'pageSnapPoints',
    type: 'number[]',
    desc: 'The current snap points of the carousel'
  },
  {
    name: 'isPlaying',
    type: 'boolean',
    desc: 'Whether the carousel is auto playing'
  },
  {
    name: 'isDragging',
    type: 'boolean',
    desc: 'Whether the carousel is being dragged. This only works when `draggable` is true.'
  },
  {
    name: 'canScrollNext',
    type: 'boolean',
    desc: 'Whether the carousel is can scroll to the next view'
  },
  {
    name: 'canScrollPrev',
    type: 'boolean',
    desc: 'Whether the carousel is can scroll to the previous view'
  },
  {
    name: 'scrollToIndex',
    type: '(index: number, instant?: boolean) => void',
    desc: 'Function to scroll to a specific item index'
  },
  {
    name: 'scrollTo',
    type: '(page: number, instant?: boolean) => void',
    desc: 'Function to scroll to a specific page'
  },
  {
    name: 'scrollNext',
    type: '(instant?: boolean) => void',
    desc: 'Function to scroll to the next page'
  },
  {
    name: 'scrollPrev',
    type: '(instant?: boolean) => void',
    desc: 'Function to scroll to the previous page'
  },
  {
    name: 'getProgress',
    type: '() => number',
    desc: 'Returns the current scroll progress as a percentage'
  },
  {
    name: 'play',
    type: '() => void',
    desc: 'Function to start/resume autoplay'
  },
  {
    name: 'pause',
    type: '() => void',
    desc: 'Function to pause autoplay'
  },
  {
    name: 'isInView',
    type: '(index: number) => boolean',
    desc: 'Whether the item is in view'
  },
  {
    name: 'refresh',
    type: '() => void',
    desc: 'Function to re-compute the snap points and clamp the page'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the carousel'
    },
  ],
  itemGroup: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'item-group'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the item'
    },
    {
      name: 'data-dragging',
      desc: 'Present when in the dragging state'
    },
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'item'
    },
    {
      name: 'data-index',
      desc: 'The index of the item'
    },
    {
      name: 'data-inview',
      desc: 'Present when in viewport'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the item'
    },
  ],
  control: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'control'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the control'
    },
  ],
  prevTrigger: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'prev-trigger'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the prevtrigger'
    },
  ],
  nextTrigger: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'next-trigger'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the nexttrigger'
    },
  ],
  indicatorGroup: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'indicator-group'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the indicatorgroup'
    },
  ],
  indicator: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'indicator'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the indicator'
    },
    {
      name: 'data-index',
      desc: 'The index of the item'
    },
    {
      name: 'data-readonly',
      desc: 'Present when read-only'
    },
    {
      name: 'data-current',
      desc: 'Present when current'
    },
  ],
  autoplayTrigger: [
    {
      name: 'data-scope',
      desc: 'carousel'
    },
    {
      name: 'data-part',
      desc: 'autoplay-trigger'
    },
    {
      name: 'data-orientation',
      desc: 'The orientation of the autoplaytrigger'
    },
    {
      name: 'data-pressed',
      desc: 'Present when pressed'
    },
  ],
}
