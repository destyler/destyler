import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const presenceComponentName = [
  'Presence',
]

export function DestylerPresenceResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (presenceComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
