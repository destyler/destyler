import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const breadcrumbsComponentName = [
  'BreadcrumbsContent',
  'BreadcrumbsItem',
  'BreadcrumbsLabel',
  'BreadcrumbsRoot',
  'BreadcrumbsSeparator',
]

export function BreadcrumbsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (breadcrumbsComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
