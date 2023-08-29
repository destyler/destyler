import type { ComponentResolver } from 'unplugin-vue-components'

export function DestylerUIResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name.startsWith('Destyler'))
        return { name, from: 'destyler' }
    },
  }
}
