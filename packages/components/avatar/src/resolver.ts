import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const avatarComponentName = ['DestylerAvatarRoot', 'DestylerAvatarImage', 'DestylerAvatarFallback']

export function DestylerAvatarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (avatarComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
