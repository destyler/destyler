import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const visuallyhiddenComponentName = [
  'DestylerVisuallyhidden',
]

export function DestylerVisuallyhiddenResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (visuallyhiddenComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
