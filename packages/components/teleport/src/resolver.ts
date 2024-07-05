import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const teleportComponentName = [
  'TeleportPrimitive',
]

export function DestylerTeleportResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (teleportComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
