import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const componentName = [
  'BreadcrumbsContent',
  'BreadcrumbsItem',
  'BreadcrumbsLabel',
  'BreadcrumbsRoot',
  'BreadcrumbsSeparator',
]

export function DestylerTemplateResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (componentName.includes(name))
        return { name, from: packageName }
    },
  }
}
