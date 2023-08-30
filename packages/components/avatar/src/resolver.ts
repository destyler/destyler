import type { ComponentResolver } from 'unplugin-vue-components'

export function DestylerAvatarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerAvatar')
        return { name, from: '@destyler/avatar' }
    },
  }
}
