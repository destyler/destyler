import type { ComponentResolver } from 'unplugin-vue-components'

export function DestylerIconResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerAvatar')
        return { name, from: '@destyler/avatar' }
    },
  }
}
