import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerVisuallyhiddenResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (['DestylerVisuallyhidden', 'DestylerVisuallyhiddenInput'].includes(name))
        return { name, from: packageName }
    },
  }
}
