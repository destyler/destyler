import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export function DestylerToggleGroupResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (name === 'DestylerToggleGroupRoot' || name === 'DestylerToggleGroupitem')
        return { name, from: packageName }
    },
  }
}
