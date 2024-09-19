import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const paginationComponentName = [
  'PaginationEllipsis',
  'PaginationFirst',
  'PaginationLast',
  'PaginationList',
  'PaginationListItem',
  'PaginationNext',
  'PaginationPrev',
  'PaginationRoot',
]

export function PaginationResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (paginationComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
