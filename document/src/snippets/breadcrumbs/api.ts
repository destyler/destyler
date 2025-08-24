export const matchContext = [
  {
    name: 'ids',
    type: 'Partial<{ root: string; list: string; separator: string; }>',
    desc: 'The ids of the elements in the collapsible. Useful for composition.'
  },
  {
    name: 'items',
    type: '{id: string; label: string; href?: string;}[]',
    desc: 'The items of the breadcrumbs.'
  },
]

export const matchApi = [
  {
    name: 'items',
    type: '{id: string; label: string; href?: string;}[]',
    desc: 'The items of the breadcrumbs.'
  },
]

export const styleApi = {
  root: [
    {
      name: 'data-scope',
      desc: 'breadcrumbs'
    },
    {
      name: 'data-part',
      desc: 'root'
    }
  ],
  list: [
    {
      name: 'data-scope',
      desc: 'breadcrumbs'
    },
    {
      name: 'data-part',
      desc: 'list'
    },
  ],
  item: [
    {
      name: 'data-scope',
      desc: 'breadcrumbs'
    },
    {
      name: 'data-part',
      desc: 'item'
    }
  ],
  link: [
    {
      name: 'data-scope',
      desc: 'breadcrumbs'
    },
    {
      name: 'data-part',
      desc: 'link'
    },
    {
      name: 'data-current',
      desc: 'page'
    }
  ],
  separator: [
    {
      name: 'data-scope',
      desc: 'breadcrumbs'
    },
    {
      name: 'data-part',
      desc: 'separator'
    }
  ]
}
