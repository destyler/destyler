import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const collectionComponentName = [
  'CollectionItem',
  'CollectionSlot',
]

export function CollectionResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (collectionComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
