import type { ComponentResolver } from 'unplugin-vue-components'

export function DestylerIconResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerButton')
        return { name, from: '@destyler/icon' }
    },
  }
}
