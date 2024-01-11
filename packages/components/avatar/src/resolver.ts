import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerAvatarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (['DestylerAvatarRoot', 'DestylerAvatarImage', 'DestylerAvatarFallback'].includes(name))
        return { name, from: packageName }
    },
  }
}
