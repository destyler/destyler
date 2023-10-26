import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerLazyTeleportResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerLazyTeleport')
        return { name, from: packageName }
    },
  }
}
