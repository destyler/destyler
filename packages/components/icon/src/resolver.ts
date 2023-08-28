import type { ComponentResolver } from 'unplugin-vue-components'

export function DestylerIconResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerIcon')
        return { name, from: '@destyler/icon' }
    },
  }
}
