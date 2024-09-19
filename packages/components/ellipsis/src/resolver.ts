import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const ellipsisComponentName = [
  'EllipsisArrow',
  'EllipsisContent',
  'EllipsisPortal',
  'EllipsisProvider',
  'EllipsisRoot',
  'EllipsisTrigger',
]

export function EllipsisResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (ellipsisComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
