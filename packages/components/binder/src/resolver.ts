import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerBinderResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerBinder' || name === 'DestylerTarget' || name === 'DestylerFollower')
        return { name, from: packageName }
    },
  }
}
