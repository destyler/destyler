import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const navigationComponentName = [
  'NavigationContent',
  'NavigationIndicator',
  'NavigationItem',
  'NavigationLink',
  'NavigationList',
  'NavigationRoot',
  'NavigationSub',
  'NavigationTrigger',
  'NavigationViewport',
]

export function NavigationResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (navigationComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
