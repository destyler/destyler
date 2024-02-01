import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dismissableLayerComponentName = [
  'DestylerDismissableLayer',
  'DestylerDismissableLayerBranch',
]

export function DestylerDismissableLayerResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dismissableLayerComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
