import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const collapsibleComponentName = [
  'CollapsibleRoot',
  'CollapsibleTrigger',
  'CollapsibleContent',
]

export function CollapsibleResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (collapsibleComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
