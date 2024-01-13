import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerDismissableLayerResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (['DestylerDismissableLayer', 'DestylerDismissableLayerBranch'].includes(name))
        return { name, from: packageName }
    },
  }
}
