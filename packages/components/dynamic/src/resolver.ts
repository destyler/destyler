import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dynamicComponentName = [
  'DynamicClear',
  'DynamicInput',
  'DynamicItem',
  'DynamicItemDelete',
  'DynamicItemText',
  'DynamicRoot',
]

export function DynamicResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dynamicComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
