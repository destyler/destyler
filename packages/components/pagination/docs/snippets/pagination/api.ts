export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; ellipsis(index: number): string; prevTrigger: string; nextTrigger: string; item(page: number): string; }>',
    desc: 'The ids of the elements in the accordion. Useful for composition.'
  },
  {
    name: 'translations',
    type: 'IntlTranslations',
    desc: 'Specifies the localized strings that identifies the accessibility elements and their states'
  },
  {
    name: 'count',
    type: 'number',
    desc: 'Total number of data items'
  },
  {
    name: 'pageSize',
    type: 'number',
    desc: 'Number of data items per page'
  },
  {
    name: 'siblingCount',
    type: 'number',
    desc: 'Number of pages to show beside active page'
  },
  {
    name: 'page',
    type: 'number',
    desc: 'The active page'
  },
  {
    name: 'onPageChange',
    type: '(details: PageChangeDetails) => void',
    desc: 'Called when the page number is changed'
  },
  {
    name: 'onPageSizeChange',
    type: '(details: PageSizeChangeDetails) => void',
    desc: 'Called when the page size is changed'
  },
  {
    name: 'type',
    type: '"button" | "link"',
    desc: 'The type of the trigger element'
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
]

export const matchApi = [
  {
    name: 'page',
    type: 'number',
    desc: 'The current page.'
  },
  {
    name: 'count',
    type: 'number',
    desc: 'The total number of data items.'
  },
  {
    name: 'pageSize',
    type: 'number',
    desc: 'The number of data items per page.'
  },
  {
    name: 'totalPages',
    type: 'number',
    desc: 'The total number of pages.'
  },
  {
    name: 'pages',
    type: 'Pages',
    desc: 'The page range. Represented as an array of page numbers (including ellipsis)'
  },
  {
    name: 'previousPage',
    type: 'number',
    desc: 'The previous page.'
  },
  {
    name: 'nextPage',
    type: 'number',
    desc: 'The next page.'
  },
  {
    name: 'pageRange',
    type: 'PageRange',
    desc: 'The page range. Represented as an object with `start` and `end` properties.'
  },
  {
    name: 'slice',
    type: '<V>(data: V[]) => V[]',
    desc: 'Function to slice an array of data based on the current page.'
  },
  {
    name: 'setCount',
    type: '(count: number) => void',
    desc: 'Function to set the total number of pages.'
  },
  {
    name: 'setPageSize',
    type: '(size: number) => void',
    desc: 'Function to set the page size.'
  },
  {
    name: 'setPage',
    type: '(page: number) => void',
    desc: 'Function to set the current page.'
  },
  {
    name: 'goToNextPage',
    type: '() => void',
    desc: 'Function to go to the next page.'
  },
  {
    name: 'goToPrevPage',
    type: '() => void',
    desc: 'Function to go to the previous page.'
  },
  {
    name: 'goToFirstPage',
    type: '() => void',
    desc: 'Function to go to the first page.'
  },
  {
    name: 'goToLastPage',
    type: '() => void',
    desc: 'Function to go to the last page.'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'pagination'
    },
    {
      name: 'data-part',
      desc: 'root'
    },
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'pagination'
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
      name: 'data-selected',
      desc: 'Present when selected'
    }
  ],
  ellipsis: [
    {
      name: 'data-scope',
      desc: 'pagination'
    },
    {
      name: 'data-part',
      desc: 'ellipsis'
    },
  ],
  prevTrigger: [
    {
      name: 'data-scope',
      desc: 'pagination'
    },
    {
      name: 'data-part',
      desc: 'prev-trigger'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    }
  ],
  nextTrigger: [
    {
      name: 'data-scope',
      desc: 'pagination'
    },
    {
      name: 'data-part',
      desc: 'next-trigger'
    },
    {
      name: 'data-disabled',
      desc: 'Present when disabled'
    }
  ]
}
