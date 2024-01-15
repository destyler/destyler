import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerCollapsibleResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (['DestylerCollapsibleRoot', 'DestylerCollapsibleTrigger', 'DestylerCollapsibleContent'].includes(name))
        return { name, from: packageName }
    },
  }
}
