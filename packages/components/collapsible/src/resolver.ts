import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const cllapsibleComponentName = [
  'DestylerCollapsibleRoot',
  'DestylerCollapsibleTrigger',
  'DestylerCollapsibleContent',
]

export function DestylerCollapsibleResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (cllapsibleComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
