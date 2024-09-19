import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const dismissableLayerComponentName = [
  'DismissableLayer',
  'DismissableLayerBranch',
]

export function DismissableLayerResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (dismissableLayerComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
